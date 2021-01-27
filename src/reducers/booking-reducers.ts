import { BOOKING_FETCH_DATA_SUCCESS, BOOKING_IS_LOADING, BOOKING_HAS_ERRORED, CLEAR_ERRORS, DELETE_BOOKING, DELETE_BOOKING_SUCCESS, UPDATE_BOOKING, UPDATE_BOOKING_SUCCESS, UPDATE_BOOKING_ERRORS, ADD_BOOKING, ADD_BOOKING_SUCCESS, ADD_BOOKING_ERRORS } from '../actions/types';

export interface TypeBooking {
    _id: string;
    fio: string;
    startDate: any;
    endDate: any;
    cost: string;
    room: string;
}

export function bookingHasErrored(state = false, action: any) {
    switch (action.type) {
        case BOOKING_HAS_ERRORED:
            return action.hasErrored;

        default:
            return state;
    }
}

export function bookingIsLoading(state = false, action: any) {
    switch (action.type) {
        case BOOKING_IS_LOADING:
            return action.isLoading;

        default:
            return state;
    }
}

export function booking(state:TypeBooking[] = [], action: any) {
    const payload = action.payload
    switch (action.type) {
        case BOOKING_FETCH_DATA_SUCCESS:
            var newArr:any = action.booking
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
            var newArr:any = state.concat(payload);
            state = [];
            state.concat(newArr);
            return state.concat(newArr);

        default:
            return state;
    }
}