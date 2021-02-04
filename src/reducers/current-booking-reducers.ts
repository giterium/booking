import {
    UPDATED_CURRENT_BOOKING
} from "../actions/types";

import {TypeBooking} from "./booking-reducers";

export function currentBooking(state:TypeBooking = {}, action:{type: string; payload: TypeBooking;}) {
    const payload = action.payload
    switch (action.type) {
        case UPDATED_CURRENT_BOOKING:
            return payload;
        default:
            return state;
    }
}