import React, { useState, useEffect } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import {itemsRoomsFetchData} from '../actions/rooms-actions';
import {itemsBookingFetchData} from '../actions/booking-actions';
import {Shahmatka} from './BookingShahmatka';
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
    setOpenWindow: Function;
    currentBooking: TypeBooking;
    setCurrentBooking: Function;
    selected: TypeSelected;
    setSelected: Function;
}

interface TypesProps {
    rooms: TypeRoom[];
    hasErrored: boolean;
    isLoading: boolean;
    history: History;
    fetchDataRooms: Function;
    roomsHasErrored: Function;
    roomsIsLoading: Function;
    router: Function;
}

interface TypeItemSelected {
    day: null | Moment;
    room: string | boolean;
}

interface TypeSelected {
    start: TypeItemSelected;
    end: TypeItemSelected;
}

export const WindowContext = React.createContext({} as IContextProps);

export const Booking = ({props: TypesProps}) => {
    const bookingIsLoading: Function = useSelector((state: RootState) => state.bookingIsLoading, shallowEqual);
    const bookingHasErrored: Function = useSelector((state: RootState) => state.bookingHasErrored, shallowEqual);
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

    document.title = "Booking";

    if (bookingHasErrored) {
        dispatch(bookingHasErrored(false));
        return <div id="wrapper"><LoadError /></div>;
    }

    if (bookingIsLoading) {
        return <div id="wrapper"><Loading /></div>;
    }

    return <div id="wrapper">
        <div className="deptsList" >
            <TitlePage title='Booking' />
            <WindowContext.Provider value={{ openWindow, setOpenWindow, currentBooking, setCurrentBooking, selected, setSelected}}>
                <Shahmatka />
                <BookingModal />
            </WindowContext.Provider>
        </div>
    </div>
}
