import {TypeRoom} from "../reducers/rooms-reducers";
import {store} from "../configureStore";
import {TypeSelected} from "../reducers/selected-reducers";
import {TypeBooking} from "../reducers/booking-reducers";
import moment from "moment";
import {setCurrentBooking, timenull, updateSelected, TypeDay} from "./booking-utils";
import {isGoodRange} from "./isGoodRange";

export const checkBooking = (startDate:Date, endDate:Date, room = ''): [Date, Date, string] | boolean => {
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
        if(room == '') {
            room = currentBooking.room;
        }
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