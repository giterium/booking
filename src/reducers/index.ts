import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import errorReducer from './errors-reducers';
import {rooms, roomsHasErrored, roomsIsLoading, TypeRoom} from './rooms-reducers';
import {booking, bookingHasErrored, bookingIsLoading, TypeBooking} from './booking-reducers';
import {selected, TypeSelected} from './selected-reducers';
import {currentBooking} from './current-booking-reducers';

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    errors: errorReducer,
    rooms,
    roomsHasErrored,
    roomsIsLoading,
    booking,
    bookingHasErrored,
    bookingIsLoading,
    selected,
    currentBooking
})

export default rootReducer;

export interface RootState {
    router: any;
    errors: any;
    rooms: TypeRoom[];
    roomsHasErrored: boolean;
    roomsIsLoading: boolean;
    booking: TypeBooking[];
    selected: TypeSelected;
    bookingHasErrored: boolean;
    bookingIsLoading: boolean;
    currentBooking: TypeRoom;
}