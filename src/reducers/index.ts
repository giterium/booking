import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import errorReducer from './errors-reducers';
import {rooms, roomsHasErrored, roomsIsLoading} from './rooms-reducers';
import {booking, bookingHasErrored, bookingIsLoading} from './booking-reducers';

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    errors: errorReducer,

    rooms,
    roomsHasErrored,
    roomsIsLoading,

    booking,
    bookingHasErrored,
    bookingIsLoading
})

export default rootReducer;