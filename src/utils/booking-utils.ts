import moment from "moment";
import styles from "../css/booking.module.css";
import { store } from '../configureStore';
import {TypeBooking} from "../reducers/booking-reducers";
import { createAction } from 'redux-actions';
import {TypeRoom} from "../reducers/rooms-reducers";
import {TypeSelected} from "../reducers/selected-reducers";

export const updateSelected = createAction(
    'UPDATED_SELECTED',
    updates => updates,
);

export const setCurrentBooking = createAction(
    'UPDATED_CURRENT_BOOKING',
    updates => updates,
);

export function momentNullDate () {
    var date = "1970-01-01";
    var time = "00:00";

    return moment(date + ' ' + time);
}

const unSelected = () => {
    store.dispatch(updateSelected({
        start:{day:momentNullDate(), room:''},
        end:{day:momentNullDate(), room:''}
    }))
}

export function isGoodRange (startDate, endDate, id_room, curIdBooking = '') {

    const booking:TypeBooking[] = store.getState().booking;
    const bookingSlice = booking.filter(item => item.room == id_room)
    for(const curBooking of bookingSlice) {
        if(
            (
                moment(timenull(startDate)).isAfter(timenull(curBooking.startDate)) && moment(timenull(startDate)).isBefore(timenull(curBooking.endDate))
                ||
                moment(timenull(endDate)).isAfter(timenull(curBooking.startDate)) && moment(timenull(endDate)).isBefore(timenull(curBooking.endDate))
                ||
                moment(timenull(startDate)).isSameOrBefore(timenull(curBooking.startDate)) && moment(timenull(endDate)).isSameOrAfter(timenull(curBooking.endDate))
                ||
                moment(timenull(startDate)).isSame(timenull(curBooking.startDate)) && moment(timenull(endDate)).isSame(timenull(curBooking.endDate))
            )
            &&
            curIdBooking != curBooking._id
        ) {
            return false;
        }
    }
    return true;
}

export function timenull(date) {
    if(moment.isMoment(date))
        return date.clone().milliseconds(0).second(0).minutes(0).hours(0);
    else
        return moment(date).clone().milliseconds(0).second(0).minutes(0).hours(0).toDate();
}

export const isBooking = (day, room) => {

    const booking:TypeBooking[] = store.getState().booking;
    const bookingSlice = booking.filter(item => item.room == room._id)

    let is_booking = false;
    let is_first_booking = false;
    let is_last_booking = false;

    for(const curBooking of bookingSlice) {
        if (
            moment(timenull(curBooking.startDate)).diff(timenull(day.date)) <= 0
            &&
            moment(timenull(curBooking.endDate)).diff(timenull(day.date)) >= 0
            &&
            curBooking.room == room._id
        ) {
            if(moment(timenull(curBooking.startDate)).diff(timenull(day.date)) == 0) {
                is_first_booking = true;
            }
            if(moment(timenull(curBooking.endDate)).diff(timenull(day.date)) == 0) {
                is_last_booking = true;
            }
            is_booking = true;
        }
    }
    if(is_booking) {
        if(is_last_booking && is_first_booking)
            return styles.isBooking + ' '+styles.isFirstBooking+ ' '+styles.isLastBooking;
        else if(is_first_booking)
            return styles.isBooking + ' '+styles.isFirstBooking;
        else if(is_last_booking)
            return styles.isBooking + ' '+styles.isLastBooking;
        else
            return styles.isBooking
    }
    else
        return '';
}

const commonStylesCell = (day, room) => {
    return isBooking(day, room) + ' cell d' + day.date.format('DD-MM-YY') + ' ' +styles.dayCell;
}

export const isSelected = (day, room, selected) => {
    if(selected.start.room && !selected.end.room ) {
        if(selected.start.day.format('DD.MM.YY') == day.date.format('DD.MM.YY') && selected.start.room == room._id) {
            return commonStylesCell(day, room)  + ' ' + styles.selected +' '+ styles.firstSelected;
        }
        else {
            return commonStylesCell(day, room) ;
        }
    }
    else if(selected.start.room == room._id && selected.end.room == room._id) {
        if(selected.start.day.diff(day.date) <= 0 && selected.end.day.diff(day.date) >= 0) {
            if(selected.start.day.format('DD.MM.YY') == day.date.format('DD.MM.YY')) {
                return commonStylesCell(day, room)  + ' ' + styles.selected + ' ' + styles.firstSelected;
            }
            else if(moment(timenull(selected.end.day)).diff(timenull(day.date)) == 0) {
                return commonStylesCell(day, room) + ' ' + styles.selected + ' ' + styles.lastSelected;
            }
            else
                return commonStylesCell(day, room)  + ' ' + styles.selected;
        }
        else {
            return commonStylesCell(day, room);
        }
    }
    else {
        return commonStylesCell(day, room);
    }
}

export const changeBooking = (startDate, endDate, room = '') => {
    const rooms:TypeRoom[] = store.getState().rooms;
    const selected:TypeSelected = store.getState().selected;
    const currentBooking:TypeBooking = store.getState().currentBooking;
    const dispatch = store.dispatch;

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

            dispatch(updateSelected({
                start: {day: moment(timenull(startDate)), room: room},
                end: {day: moment(timenull(endDate)), room: room}
            }));
            return true
        }
        else if(moment(timenull(startDate)).diff(timenull(endDate), 'days') > 0 && isGoodRange(moment(endDate), moment(startDate), room)) {

            dispatch(updateSelected({
                start: {day: moment(timenull(endDate)), room: room},
                end: {day: moment(timenull(startDate)), room: room}
            }))
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
            store.dispatch(setCurrentBooking({
                _id: currentBooking._id,
                fio: currentBooking.fio,
                cost: cost+'',
                room: room,
                startDate: moment(startDate).toDate(),
                endDate: moment(endDate).toDate()
            }))
            return true
        }
        else if(moment(startDate).diff(endDate, 'days') > 0 && isGoodRange(moment(endDate), moment(startDate), room, currentBooking._id)) {
            const curRoom = rooms.filter((item) => item._id == room)[0];
            const cost = Math.abs(moment(endDate).diff(moment(startDate), "days") * parseInt(curRoom.cost));
            store.dispatch(setCurrentBooking({
                _id: currentBooking._id,
                fio: currentBooking.fio,
                cost: cost+'',
                room: room,
                startDate: moment(endDate).toDate(),
                endDate: moment(startDate).toDate()
            }))
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


export const clickDayRoom = (day, room) => {
    const dispatch = store.dispatch;
    const selected:TypeSelected = store.getState().selected;

    if(isBooking(day, room) != styles.isBooking && isBooking(day, room) != styles.isBooking + ' '+styles.isFirstBooking+ ' '+styles.isLastBooking) {
        if (!selected.start.room) {
            dispatch(updateSelected({
                start: {day: day.date, room: room._id},
                end: {day: momentNullDate(), room: ''}
            }))
        } else {
            if (!selected.end.room) {

                if(isGoodRange(selected.start.day, day.date, room._id)) {
                    if (selected.start.day.format('DD.MM.YY') == day.date.format('DD.MM.YY')) {
                        unSelected();
                    } else if (selected.start.room != room._id)
                        unSelected();
                    else {

                        if (day.date < selected.start.day) {
                            dispatch(updateSelected({
                                start: {day: day.date, room: room._id},
                                end: selected.start
                            }))
                        }
                        else {
                            dispatch(updateSelected({
                                start: selected.start,
                                end: {day: day.date, room: room._id}

                            }))
                        }
                    }
                }
                else {
                    unSelected();
                }
            }
            else {
                unSelected();
            }
        }
    }
    else {
        unSelected();
    }
};