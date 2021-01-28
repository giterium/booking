import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import errorReducer from './errors-reducers';
import {rooms, roomsHasErrored, roomsIsLoading, TypeRoom} from './rooms-reducers';
import {booking, bookingHasErrored, bookingIsLoading, TypeBooking} from './booking-reducers';

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

export interface RootState {
    router: Function;
    errors: any;
    rooms: TypeRoom[];
    roomsHasErrored: boolean;
    roomsIsLoading: boolean;
    booking: TypeBooking[];
    bookingHasErrored: boolean;
    bookingIsLoading: boolean;
}