import React, { useState, useEffect } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import {itemsRoomsFetchData} from '../actions/rooms-actions';
import {itemsBookingFetchData} from '../actions/booking-actions';
import {Calendar} from './BookingCalendar';
import {BookingModal} from './BookingModal';
import {Loading} from '../components/Loading';
import {LoadError} from '../components/LoadError';
import {TitlePage} from '../components/TitlePage';
import {TypeRoom} from '../reducers/rooms-reducers';
import {RootState} from '../reducers';
import {TypeBooking} from '../reducers/booking-reducers';
import {useHistory} from "react-router";
import moment, {Moment} from 'moment';
import styles from '../css/booking.module.css';

export interface IContextProps {
    openWindow: boolean;
    setOpenWindow: (a: boolean) => void;
    currentBooking: TypeBooking;
    setCurrentBooking: (a: TypeBooking) => void;
    selected: TypeSelected;
    setSelected: any;
}
/*
interface TypesProps {
    rooms: TypeRoom[];
    hasErrored: boolean;
    isLoading: boolean;
    history: History;
    fetchDataRooms: any;
    roomsHasErrored: any;
    roomsIsLoading: any;
    router: any;
}

 */

interface TypeItemSelected {
    day: null | Moment;
    room: string | boolean;
}

interface TypeSelected {
    start: TypeItemSelected;
    end: TypeItemSelected;
}

export const WindowContext = React.createContext({} as IContextProps);

export const Booking = () => {
    const bookingIsLoading: any = useSelector((state: RootState) => state.bookingIsLoading, shallowEqual);
    const bookingHasErrored: any = useSelector((state: RootState) => state.bookingHasErrored, shallowEqual);
    const [openWindow, setOpenWindow] = useState(false);
    const [currentBooking, setCurrentBooking] = useState<TypeBooking>({
        _id: 'create',
        fio: '',
        cost: '',
        room: '',
        startDate: moment(),
        endDate: moment()
    });
    const rooms: TypeRoom[] = useSelector((state: RootState) => state.rooms, shallowEqual);
    const booking: TypeBooking[] = useSelector((state: RootState) => state.booking, shallowEqual);
    const history: History = useHistory();
    const dispatch = useDispatch();
    const [selected, setSelected] = useState<TypeSelected>({
        start:{day:null, room:false},
        end:{day:null, room:false}
    });

    useEffect(() => {
        if(rooms.length == 0)
            dispatch(itemsRoomsFetchData('/api/rooms/getall'))
        if(booking.length == 0)
            dispatch(itemsBookingFetchData('/api/booking/getall'))
    }, []);

    useEffect(() => {
        if(!openWindow) {
            setSelected({
                start:{day:null, room:false},
                end:{day:null, room:false}
            });
        }
    }, [openWindow])

    document.title = "Booking";

    if (bookingHasErrored) {
        dispatch(bookingHasErrored(false));
        return <><LoadError /></>;
    }

    if (bookingIsLoading) {
        return <><Loading /></>;
    }

    const onClickBooking = (id) => {
        const editBooking = booking.filter(item => item._id == id)[0];
        setCurrentBooking(editBooking);
        setOpenWindow(true)
    }

    const changeBooking = (id) => {
        console.log(123)
    }

    const changeSelected = (selected) => {
        setCurrentBooking({
            _id: 'create',
            cost: 0,
            fio: '',
            room: selected.start.room,
            startDate: selected.start.day.format('YYYY-MM-DD'),
            endDate: moment(selected.end.day).format('YYYY-MM-DD')
        });
        setSelected(selected);
        setOpenWindow(true);
    }

    return <div id="wrapper">
        <div className="deptsList" >
            <TitlePage title='Booking' />
            <WindowContext.Provider value={{ openWindow, setOpenWindow, currentBooking, setCurrentBooking, selected, setSelected}}>
                <Calendar
                    onChangeSelected={changeSelected}
                    onClickBooking={onClickBooking}
                    rooms={rooms}
                    booking={booking}
                    selected={selected}
                />
                <BookingModal
                    onChangeBooking={changeBooking}
                />
            </WindowContext.Provider>
        </div>
    </div>
}
