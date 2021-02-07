import moment, { Moment } from "moment"
import styles from "../css/booking.module.css"
import { store } from '../configureStore'
import {TypeBooking} from "../reducers/booking-reducers"
import { createAction } from 'redux-actions'
import {TypeSelected} from "../reducers/selected-reducers"
import {isGoodRange} from "./isGoodRange"

export const updateSelected = createAction(
    'UPDATED_SELECTED',
    updates => updates,
);

export const setCurrentBooking = createAction(
    'UPDATED_CURRENT_BOOKING',
    updates => updates,
);

export function momentNullDate ():Moment {
    return moment("1970-01-01 00:00")
}

const unSelected = () => {
    store.dispatch(updateSelected({
        start:{day:momentNullDate(), room:''},
        end:{day:momentNullDate(), room:''}
    }))
}

export function timenull(date: Date | Moment):(Date | Moment) {
    if(moment.isMoment(date))
        return date.clone().milliseconds(0).second(0).minutes(0).hours(0)
    else
        return moment(date).clone().milliseconds(0).second(0).minutes(0).hours(0).toDate()
}

export const isBooking = (day, room) => {
    const currentBooking:TypeBooking = store.getState().currentBooking
    const booking:TypeBooking[] = store.getState().booking

    const bookingWithCurrent = [...booking]
    const index = booking.findIndex((p) => p._id == currentBooking._id)
    if(index != -1) {
        bookingWithCurrent[index] = {...currentBooking}
    }
    const bookingSlice = bookingWithCurrent.filter(item => item.room == room._id)

    let is_booking = false
    let is_first_booking = false
    let is_last_booking = false

    for(const curBooking of bookingSlice) {
        if (
            moment(timenull(curBooking.startDate)).diff(timenull(day.date)) <= 0
            &&
            moment(timenull(curBooking.endDate)).diff(timenull(day.date)) >= 0
            &&
            curBooking.room == room._id
        ) {
            if(moment(timenull(curBooking.startDate)).diff(timenull(day.date)) == 0) {
                is_first_booking = true
            }
            if(moment(timenull(curBooking.endDate)).diff(timenull(day.date)) == 0) {
                is_last_booking = true
            }
            is_booking = true
        }
    }
    if(is_booking) {
        if(is_last_booking && is_first_booking)
            return styles.isBooking + ' '+styles.isFirstBooking+ ' '+styles.isLastBooking
        else if(is_first_booking)
            return styles.isBooking + ' '+styles.isFirstBooking
        else if(is_last_booking)
            return styles.isBooking + ' '+styles.isLastBooking
        else
            return styles.isBooking
    }
    else
        return ''
}

export const commonStylesCell = (day, room) => {
    return isBooking(day, room) + ' cell d' + day.date.format('DD-MM-YY') + ' ' +styles.dayCell
}

export const isSelected = (day, room, selected) => {
    if(selected.start.room && !selected.end.room ) {
        if(selected.start.day.format('DD.MM.YY') == day.date.format('DD.MM.YY') && selected.start.room == room._id) {
            return styles.selected +' '+ styles.firstSelected
        }
        else {
            return ''
        }
    }
    else if(selected.start.room == room._id && selected.end.room == room._id) {
        if(selected.start.day.diff(day.date) <= 0 && selected.end.day.diff(day.date) >= 0) {
            if(selected.start.day.format('DD.MM.YY') == day.date.format('DD.MM.YY')) {
                return styles.selected + ' ' + styles.firstSelected
            }
            else if(moment(timenull(selected.end.day)).diff(timenull(day.date)) == 0) {
                return styles.selected + ' ' + styles.lastSelected
            }
            else
                return styles.selected
        }
        else {
            return ''
        }
    }
    else {
        return ''
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
                    unSelected()
                }
            }
            else {
                unSelected()
            }
        }
    }
    else {
        unSelected()
    }
};