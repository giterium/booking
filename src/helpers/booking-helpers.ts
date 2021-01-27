import moment from "moment";

export function isGoodDiapazon (startDate, endDate, id_room, booking, curIdBooking = '') {

    for(const curBooking of booking) {
        if(
            (
                moment(timenull(startDate)).isAfter(timenull(curBooking.startDate)) && moment(timenull(startDate)).isBefore(timenull(curBooking.endDate))
                ||
                moment(timenull(endDate)).isAfter(timenull(curBooking.startDate)) && moment(timenull(endDate)).isBefore(timenull(curBooking.endDate))
            )
            &&
            id_room == curBooking.room
            &&
            curIdBooking != curBooking._id
        )
            return  false;
    }
    return true;
}


export function timenull(date) {
    if(moment.isMoment(date))
        return date.clone().milliseconds(0).second(0).minutes(0).hours(0);
    else
        return moment(date).clone().milliseconds(0).second(0).minutes(0).hours(0).toDate();
}