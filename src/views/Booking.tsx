import React, { useState, useEffect, ReactElement } from 'react';
import {useDispatch, shallowEqual, useSelector} from 'react-redux';
import {itemsRoomsFetchData} from '../actions/rooms-actions';
import {clearErrors, deleteBooking, createBooking, itemsBookingFetchData, updateBooking} from '../actions/booking-actions';
import {Calendar} from './BookingCalendar';
import {BookingModal} from './BookingModal';
import {Loading} from '../components/Loading';
import {LoadError} from '../components/LoadError';
import {TitlePage} from '../components/TitlePage';
import {TypeRoom} from '../reducers/rooms-reducers';
import {RootState} from '../reducers';
import {TypeBooking} from '../reducers/booking-reducers';
import moment from 'moment';
import {timenull, updateSelected, setCurrentBooking, momentNullDate} from "../utils/booking-utils";

export interface IContextProps {
    openWindow: boolean;
    setOpenWindow: (a: boolean) => void;
    currentBooking: TypeBooking;
}
export interface BookingProps {
    startDate?: Date;
    endDate?: Date;
}

export const WindowContext = React.createContext({});

export const Booking = (props: BookingProps): ReactElement => {
    const bookingIsLoading: boolean = useSelector((state: RootState) => state.bookingIsLoading, shallowEqual);
    const bookingHasErrored: (a: boolean) => boolean = useSelector((state: RootState) => state.bookingHasErrored, shallowEqual);
    const [openWindow, setOpenWindow] = useState(false);
    const currentBooking: TypeBooking = useSelector((state: RootState) => state.currentBooking, shallowEqual);

    const rooms: TypeRoom[] = useSelector((state: RootState) => state.rooms, shallowEqual)
    const booking: TypeBooking[] = useSelector((state: RootState) => state.booking, shallowEqual)
    const dispatch = useDispatch()

    useEffect(() => {
        if(rooms.length == 0)
            dispatch(itemsRoomsFetchData('/api/rooms/getall'))
        if(booking.length == 0)
            dispatch(itemsBookingFetchData('/api/booking/getall'))
    }, []);

    const actionClose = () => {
        dispatch(updateSelected({
            start:{day:momentNullDate(), room:false},
            end:{day:momentNullDate(), room:false}
        }))
        dispatch(setCurrentBooking({}));
    }

    const actionDelete = (id) => {
        if(confirm('Delete?')) {
            dispatch(deleteBooking(
                id,
                booking.findIndex(item => item._id == id)
            ));
        }
    }

    const actionModal = (cost, fio, room, startDate, endDate) => {
        if(currentBooking._id == 'create') {
            dispatch(setCurrentBooking({}))

            dispatch(createBooking({
                _id: '',
                cost: cost,
                fio: fio,
                room: room,
                startDate: startDate,
                endDate: endDate
            }))
        }
        else {
            dispatch(setCurrentBooking({}))

            dispatch(updateBooking({
                _id: currentBooking._id,
                cost: currentBooking.cost,
                fio: fio,
                room: currentBooking.room,
                startDate: currentBooking.startDate,
                endDate: currentBooking.endDate
            }, booking.findIndex(item => item._id == currentBooking._id)))
        }
    }

    const onClickBooking = (id: string) => {
        dispatch(clearErrors())
        const editBooking = booking.filter(item => item._id == id)[0]
        dispatch(setCurrentBooking(editBooking))
        setOpenWindow(true)
    }

    document.title = "Booking"

    if (bookingHasErrored) {
        dispatch(bookingHasErrored(false))
        return <><LoadError /></>
    }

    if (bookingIsLoading) {
        return <><Loading /></>
    }

    return  <div id="wrapper">
                <TitlePage title='Booking' />
                <Calendar
                    onClickBooking={onClickBooking}
                    startDate={props.startDate ? props.startDate : timenull(moment())}
                    endDate={props.endDate ? props.endDate : timenull(moment().add(13,'days'))}
                />
                <WindowContext.Provider value={{ openWindow, setOpenWindow }}>
                    <BookingModal
                        onActionModal={actionModal}
                        onActionDelete={actionDelete}
                        onActionClose={actionClose}
                    />
                </WindowContext.Provider>
            </div>
}