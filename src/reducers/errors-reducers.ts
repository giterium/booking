import { GET_ERRORS, CLEAR_ERRORS, UPDATE_BOOKING_ERRORS, ADD_BOOKING_ERRORS} from '../actions/types';

const initialState = {};

export default function(state = initialState, action ) {
    switch(action.type) {
        case GET_ERRORS:
            return action.payload;
        case CLEAR_ERRORS:
            return action.payload;
        case ADD_BOOKING_ERRORS:
            return action.payload;
        case UPDATE_BOOKING_ERRORS:
            return action.payload;
        default:
            return state;
    }
}