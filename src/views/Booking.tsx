import React, { useState, useEffect } from 'react';
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
import moment, {Moment} from 'moment';
import {isGoodRange, timenull} from "../helpers/booking-helpers";

export interface IContextProps {
    openWindow: boolean;
    setOpenWindow: (a: boolean) => void;
    currentBooking: TypeBooking;
}

interface TypeItemSelected {
    day: null | Moment;
    room: string | boolean;
}

interface TypeSelected {
    start: TypeItemSelected;
    end: TypeItemSelected;
}

export const WindowContext = React.createContext({});

export const Booking = () => {
    const bookingIsLoading: boolean = useSelector((state: RootState) => state.bookingIsLoading, shallowEqual);
    const bookingHasErrored: (a: boolean) => boolean = useSelector((state: RootState) => state.bookingHasErrored, shallowEqual);
    const [openWindow, setOpenWindow] = useState(false);
    const [currentBooking, setCurrentBooking] = useState({
        _id: 'create',
        fio: '',
        cost: '',
        room: '',
        startDate: moment(),
        endDate: moment()
    });
    const rooms: TypeRoom[] = useSelector((state: RootState) => state.rooms, shallowEqual)
    const booking: TypeBooking[] = useSelector((state: RootState) => state.booking, shallowEqual)
    const dispatch = useDispatch()
    const [selected, setSelected] = useState({
        start:{day:null, room:false},
        end:{day:null, room:false}
    })

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

    document.title = "Booking"

    if (bookingHasErrored) {
        dispatch(bookingHasErrored(false))
        return <><LoadError /></>
    }

    if (bookingIsLoading) {
        return <><Loading /></>
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
            dispatch(createBooking({
                _id: '',
                cost: cost,
                fio: fio,
                room: room,
                startDate: startDate,
                endDate: endDate
            }));
        }
        else {
            dispatch(updateBooking({
                _id: currentBooking._id,
                cost: currentBooking.cost,
                fio: fio,
                room: currentBooking.room,
                startDate: currentBooking.startDate,
                endDate: currentBooking.endDate
            }, booking.findIndex(item => item._id == currentBooking._id)));
        }
    }

    const onClickBooking = (id) => {
        dispatch(clearErrors())
        const editBooking = booking.filter(item => item._id == id)[0]
        setCurrentBooking(editBooking)
        setOpenWindow(true)
    }

    const changeBooking = (startDate, endDate, room = '') => {
        if ((selected.start.day && selected.end.day && currentBooking._id == 'create') || currentBooking._id != 'create') {
            if(currentBooking._id == 'create') {
                if(room == '')
                    room = selected.start.room;
                if(moment(timenull(startDate)).isSame(timenull(endDate))) {
                    alert('Дата выезда и дата въезда должны различаться.')
                    return [
                        selected.start.day.toDate(),
                        selected.end.day.toDate(),
                        selected.start.room
                    ]
                }
                else if(moment(startDate).diff(endDate, 'days') < 0 &&  isGoodRange(moment(startDate), moment(endDate),  room)) {
                    setSelected({
                        start: {day: moment(timenull(startDate)), room: room},
                        end: {day: moment(timenull(endDate)), room: room}
                    });
                    return true
                }
                else if(moment(timenull(startDate)).diff(timenull(endDate), 'days') > 0 && isGoodRange(moment(endDate), moment(startDate), room)) {
                    setSelected({
                        start: {day: moment(timenull(endDate)), room: room},
                        end: {day: moment(timenull(startDate)), room: room}
                    })
                    return [
                        endDate,
                        startDate,
                        selected.start.room
                    ]
                }
                else {
                    alert('На этот дипазон уже назначено бронирование.')
                    return [
                        new Date(selected.start.day.format('YYYY-MM-DD')),
                        new Date(selected.end.day.format('YYYY-MM-DD')),
                        selected.start.room
                    ]
                }
            }
            else {
                if(room == '')
                    room = currentBooking.room;
                if(moment(timenull(startDate)).isSame(timenull(endDate))) {
                    alert('Дата выезда и дата въезда должны различаться.')
                    return [
                        new Date(currentBooking.startDate),
                        new Date(currentBooking.endDate),
                        currentBooking.room
                    ]
                }
                else if(moment(startDate).diff(endDate, 'days') < 0 && isGoodRange(moment(startDate), moment(endDate), room, currentBooking._id)) {
                    const curRoom = rooms.filter((item) => item._id == room)[0];
                    const cost = Math.abs(moment(startDate).diff(moment(endDate), "days") * parseInt(curRoom.cost));
                    setCurrentBooking({
                        _id: currentBooking._id,
                        fio: currentBooking.fio,
                        cost: cost,
                        room: room,
                        startDate: moment(startDate).format('YYYY-MM-DD'),
                        endDate: moment(endDate).format('YYYY-MM-DD')
                    })
                    return true
                }
                else if(moment(startDate).diff(endDate, 'days') > 0 && isGoodRange(moment(endDate), moment(startDate), room, currentBooking._id)) {
                    const curRoom = rooms.filter((item) => item._id == room)[0];
                    const cost = Math.abs(moment(endDate).diff(moment(startDate), "days") * parseInt(curRoom.cost));
                    setCurrentBooking({
                        _id: currentBooking._id,
                        fio: currentBooking.fio,
                        cost: cost,
                        room: room,
                        startDate: moment(endDate).format('YYYY-MM-DD'),
                        endDate: moment(startDate).format('YYYY-MM-DD')
                    })
                    return [
                        moment(endDate).toDate(),
                        moment(startDate).toDate(),
                        currentBooking.room
                    ]
                }
                else {
                    alert('На этот дипазон уже назначено бронирование.')
                    return [
                        new Date(currentBooking.startDate),
                        new Date(currentBooking.endDate),
                        currentBooking.room
                    ]
                }
            }
        }
    }

    const changeSelected = (selected) => {
        const curRoom = rooms.filter((item) => item._id == selected.start.room)[0]
        const cost = Math.abs(moment(selected.start.day).diff(moment(selected.end.day), "days") * parseInt(curRoom.cost))
        setCurrentBooking({
            _id: 'create',
            cost: cost+'',
            fio: '',
            room: selected.start.room,
            startDate: selected.start.day.format('YYYY-MM-DD'),
            endDate: moment(selected.end.day).format('YYYY-MM-DD')
        })
        setSelected(selected)
        dispatch(clearErrors())
        setOpenWindow(true)
    }

    return  <div id="wrapper">
                <TitlePage title='Booking' />
                <Calendar
                    onChangeSelected={changeSelected}
                    onClickBooking={onClickBooking}
                    rooms={rooms}
                    booking={booking}
                    selected={selected}
                    startDate={timenull(moment())}
                    endDate={timenull(moment().add(13,'days'))}
                />
                <WindowContext.Provider value={{ openWindow, setOpenWindow, currentBooking}}>
                    <BookingModal
                        onChangeBooking={changeBooking}
                        onActionModal={actionModal}
                        onActionDelete={actionDelete}
                    />
                </WindowContext.Provider>
            </div>
}
