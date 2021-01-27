import { EventBus } from '../events';
import { TypeBooking } from '../reducers/booking-reducers';

import { BOOKING_FETCH_DATA_SUCCESS, BOOKING_IS_LOADING, BOOKING_HAS_ERRORED, CLEAR_ERRORS, DELETE_BOOKING, DELETE_BOOKING_SUCCESS, DELETE_BOOKING_ERRORS, UPDATE_BOOKING, UPDATE_BOOKING_SUCCESS, UPDATE_BOOKING_ERRORS, ADD_BOOKING, ADD_BOOKING_SUCCESS, ADD_BOOKING_ERRORS} from './types';

export function bookingHasErrored(bool: boolean) {
    return {
        type: BOOKING_HAS_ERRORED,
        hasErrored: bool
    };
}

export function bookingIsLoading(bool: boolean) {
    return {
        type: BOOKING_IS_LOADING,
        isLoading: bool
    };
}

export function bookingFetchDataSuccess(booking: TypeBooking[]) {
    return {
        type: BOOKING_FETCH_DATA_SUCCESS,
        booking
    };
}

export function itemsBookingFetchData(url: string) {
    return (dispatch: any) => {
        dispatch(bookingIsLoading(true));
        dispatch(bookingFetchDataSuccess([]));
        dispatch(bookingHasErrored(false));



        dispatch(bookingFetchDataSuccess([]));

        /*
        axios.get(url)
            .then((response) => {
                dispatch(bookingIsLoading(false));
                return response.data;
            })
            .then((booking) => dispatch(bookingFetchDataSuccess(booking)))
            .catch(function(err) {
                if(err.response.data == 'Unauthorized')
                    unauth('itemsRoomsFetchData', url);
                dispatch(bookingHasErrored(true))
            });

         */
    };
}

export function createBooking (booking: TypeBooking) {
    return (dispatch: any, getState: any) => {

        dispatch({type: ADD_BOOKING});
        EventBus.dispatch('bookingUpdatedAlert', [2]);
/*
        const formData = new FormData();
        formData.append('action','create')
        formData.append('booking',JSON.stringify(booking))

        axios.post('/api/booking/action', formData).then((res: any) =>{
            booking._id = res.data._id;
            dispatch({type: ADD_BOOKING_SUCCESS, payload: booking})
            EventBus.dispatch('bookingUpdatedAlert', [2]);
            //dispatch({type: USERS_IS_ADDED, isCreated: true})
        })
            .catch(err => {
                if(err.response.data == 'Unauthorized')
                    unauth();
                dispatch({
                    type: ADD_BOOKING_ERRORS,
                    payload: err.response.data
                });
            });

 */
    }
}

export function updateBooking (booking: TypeBooking, index: number) {
    return (dispatch: any, getState: any) => {
        dispatch({type: UPDATE_BOOKING});
/*
        const formData = new FormData();
        formData.append('action','update')
        //formData.append('_id',booking._id)
        formData.append('booking',JSON.stringify(booking))

        axios.post('/api/booking/action', formData).then(() =>{
            dispatch({type: UPDATE_BOOKING_SUCCESS, payload: [index, booking]})
            EventBus.dispatch('bookingUpdatedAlert', [1]);
            //dispatch({type: USERS_IS_UPDATED, isUpdated: true})
        })
            .catch(err => {
                if(err.response.data == 'Unauthorized')
                    unauth();
                dispatch({
                    type: UPDATE_BOOKING_ERRORS,
                    payload: err.response.data
                });
            });
            */
    }
}

export function deleteBooking (id: string, index:number) {
    return (dispatch: any, getState: any) => {
        dispatch({type: DELETE_BOOKING});
        /*
        const formData = new FormData();
        formData.append('action','delete')
        formData.append('id', id)

        axios.post('/api/booking/action', formData).then(() =>{
            dispatch({type: DELETE_BOOKING_SUCCESS, payload: [index, id]})
            EventBus.dispatch('bookingRemoveAlert');
            //dispatch({type: USERS_IS_UPDATED, isUpdated: true})
        })
            .catch(err => {
                if(err.response.data == 'Unauthorized')
                    unauth();
                dispatch({
                    type: DELETE_BOOKING_ERRORS,
                    payload: err.response.data
                });
            });

         */
    }
}

export function clearErrors () {
    return {
        type: CLEAR_ERRORS,
        payload: {}
    }
}