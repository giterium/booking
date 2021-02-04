import {
    UPDATED_SELECTED
} from "../actions/types";

import moment, {Moment} from "moment";
//import {momentNullDate} from "../utils/booking-utils";

function momentNullDate () {
    var date = "1970-01-01";
    var time = "00:00";

    return moment(date + ' ' + time);
}


interface TypeItemSelected {
    day: Moment;
    room: string;
}

export interface TypeSelected {
    start: TypeItemSelected;
    end: TypeItemSelected;
}

const initialState = {
    start:{day:momentNullDate(), room:''},
    end:{day:momentNullDate(), room:''}
}

export function selected(state:TypeSelected = initialState, action:{type: string; payload: TypeSelected;}):TypeSelected {
    const payload = action.payload
    switch (action.type) {
        case UPDATED_SELECTED:
            return payload;
        default:
            return state;
    }
}