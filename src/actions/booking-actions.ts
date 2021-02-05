import { EventBus } from '../events';
import { TypeBooking } from '../reducers/booking-reducers';
import { BOOKING_FETCH_DATA_SUCCESS, BOOKING_IS_LOADING, BOOKING_HAS_ERRORED, CLEAR_ERRORS, DELETE_BOOKING, DELETE_BOOKING_SUCCESS, UPDATE_BOOKING, UPDATE_BOOKING_SUCCESS, ADD_BOOKING, ADD_BOOKING_SUCCESS} from './types';

export function bookingHasErrored(bool: boolean) :{type:string; hasErrored: boolean} {
    return {
        type: BOOKING_HAS_ERRORED,
        hasErrored: bool
    }
}

export function bookingIsLoading(bool: boolean) :{type:string; isLoading: boolean} {
    return {
        type: BOOKING_IS_LOADING,
        isLoading: bool
    };
}

export function bookingFetchDataSuccess(booking: TypeBooking[]) :{type:string; booking: TypeBooking[]} {
    return {
        type: BOOKING_FETCH_DATA_SUCCESS,
        booking
    };
}

export function itemsBookingFetchData(url: string)  {
    return (dispatch) => {
        dispatch(bookingIsLoading(true))
        const bookingStore:string|null = localStorage.getItem('booking')
        let bookingList:TypeBooking[] = []
        if(bookingStore != null)
            bookingList = JSON.parse(bookingStore)

        dispatch(bookingHasErrored(false))
        setTimeout(() => {
            dispatch(bookingIsLoading(false))

            dispatch(bookingFetchDataSuccess(bookingList || []))
        }, 500)
    }
}

export function createBooking (booking: TypeBooking) {
    return (dispatch) => {
        dispatch({type: ADD_BOOKING});

        booking._id = Math.random().toString(36).substring(7);
        const bookingStore:string|null = localStorage.getItem('booking');
        let bookingList:TypeBooking[] = [];
        if(bookingStore != null)
            bookingList = JSON.parse(bookingStore);
        bookingList.push(booking);
        localStorage.setItem('booking', JSON.stringify(bookingList));

        dispatch({type: ADD_BOOKING_SUCCESS, payload: booking})
        EventBus.dispatch('bookingCloseWindow', []);
    }
}

export function updateBooking (booking: TypeBooking, index: number) {
    return (dispatch) => {
        dispatch({type: UPDATE_BOOKING});

        const bookingStore:string|null = localStorage.getItem('booking');
        let bookingList:TypeBooking[] = [];
        if(bookingStore != null)
            bookingList = JSON.parse(bookingStore);
        bookingList[index] = booking;
        localStorage.setItem('booking', JSON.stringify(bookingList));

        dispatch({type: UPDATE_BOOKING_SUCCESS, payload: [index, booking]});
        EventBus.dispatch('bookingCloseWindow', []);
    }
}

export function deleteBooking (id: string, index:number) {
    return (dispatch) => {
        dispatch({type: DELETE_BOOKING})
        const bookingStore:string|null = localStorage.getItem('booking')
        let bookingList:TypeBooking[] = []
        if(bookingStore != null)
            bookingList = JSON.parse(bookingStore)
        bookingList.splice(index, 1)
        localStorage.setItem('booking', JSON.stringify(bookingList))

        dispatch({type: DELETE_BOOKING_SUCCESS, payload: [index, id]})
        EventBus.dispatch('bookingCloseWindow', [])
    }
}

export function clearErrors () {
    return {
        type: CLEAR_ERRORS,
        payload: {}
    }
}