import moment from "moment";
import styles from "../css/booking.module.css";
import { store } from '../configureStore';
import {TypeBooking} from "../reducers/booking-reducers";
//import {RootState} from "../reducers";

export function isGoodDiapazon (startDate, endDate, id_room, curIdBooking = '') {

    const booking:TypeBooking[] = store.getState().booking;
    for(const curBooking of booking) {
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
            id_room == curBooking.room
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
    let is_booking = false;
    let is_first_booking = false;
    let is_last_booking = false;

    booking.map(curBooking => {
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
    })
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
    return isBooking(day, room) + ' d' + day.date.format('DD-MM-YY') + ' ' +styles.dayCell;
}

export const isSelected = (day, room, selected) => {
    if(selected.start.day && !selected.end.day ) {
        if(selected.start.day.format('DD.MM.YY') == day.date.format('DD.MM.YY') && selected.start.room == room._id) {
            return commonStylesCell(day, room)  + ' ' + styles.selected +' '+ styles.firstSelected;
        }
        else {
            return commonStylesCell(day, room) ;
        }
    }
    else if(selected.start.day && selected.end.day && selected.start.room == room._id && selected.end.room == room._id) {
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

