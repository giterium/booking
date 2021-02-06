import {TypeBooking} from "../reducers/booking-reducers";
import {store} from "../configureStore";
import moment, { Moment} from "moment";
import {timenull} from "./booking-utils";

export function isGoodRange (startDate: Date | Moment, endDate: Date | Moment, id_room: string, curIdBooking: string = ''): boolean {
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
                ||
                moment(timenull(startDate)).isSameOrAfter(timenull(curBooking.endDate)) && moment(timenull(endDate)).isSameOrBefore(timenull(curBooking.startDate))
            )
            &&
            curIdBooking != curBooking._id
        ) {
            return false;
        }
    }
    return true;
}