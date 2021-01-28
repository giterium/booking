import { BOOKING_FETCH_DATA_SUCCESS, BOOKING_IS_LOADING, BOOKING_HAS_ERRORED, DELETE_BOOKING_SUCCESS, UPDATE_BOOKING_SUCCESS, ADD_BOOKING_SUCCESS } from '../actions/types';

export interface TypeBooking {
    _id: string;
    fio: string;
    startDate: Date;
    endDate: Date;
    cost: string;
    room: string;
}

export function bookingHasErrored(state = false, action: {type: string; hasErrored: boolean}) {
    switch (action.type) {
        case BOOKING_HAS_ERRORED:
            return action.hasErrored;

        default:
            return state;
    }
}

export function bookingIsLoading(state = false, action: {type: string; isLoading: boolean}) {
    switch (action.type) {
        case BOOKING_IS_LOADING:
            return action.isLoading;

        default:
            return state;
    }
}


export function booking(state:TypeBooking[] = [], action: {type: string; booking: TypeBooking[]; payload: TypeBooking;}) {
    const payload = action.payload
    switch (action.type) {
        case BOOKING_FETCH_DATA_SUCCESS:
            var newArr:any = action.booking;
            return [].concat(newArr);

        case UPDATE_BOOKING_SUCCESS:
            if(payload[0] == null) payload[0] = 0;
            var newArr:any = state;
            newArr[payload[0]] = payload[1];
            state = [];
            return state.concat(newArr);

        case DELETE_BOOKING_SUCCESS:
            var newArr:any = state;
            newArr.splice(payload[0], 1);
            state = [];
            return state.concat(newArr);

        case ADD_BOOKING_SUCCESS:
            return state.concat(payload);

        default:
            return state;
    }
}