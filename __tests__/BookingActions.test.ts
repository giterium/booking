import {store} from '../src/configureStore';
import "regenerator-runtime/runtime";
import * as selectActions from "../src/actions/booking-actions";
import moment from "moment";
import {BOOKING_FETCH_DATA_SUCCESS} from "../src/actions/types";

describe('Booking actions', () => {
    test('Should dispatches correct itemsBookingFetchData', () => {
        store.dispatch(selectActions.itemsBookingFetchData(''));
        expect(store.getState().booking).toEqual([]);
    });

    test('Should dispatches correct createBooking', () => {
        expect(store.getState().booking.length).toEqual(0);
        store.dispatch(selectActions.createBooking({_id: '1234', room: '2', cost: '200', fio: '123', startDate: moment(), endDate: moment().add(2,'days')}));
        expect(store.getState().booking.length).toEqual(1);
    });

    test('Should dispatches correct updateBooking', () => {
        store.dispatch(selectActions.updateBooking({_id: '1234', room: '2', cost: '200', fio: '321', startDate: moment(), endDate: moment().add(2,'days')} , 0));
        expect(store.getState().booking[0].fio).toEqual('321');
    });

    test('Should dispatches correct deleteBooking', () => {
        store.dispatch(selectActions.deleteBooking('1234', 0));
        expect(store.getState().booking.length).toEqual(0);
    });

    test('Should dispatches correct bookingHasErrored', () => {
        store.dispatch(selectActions.bookingHasErrored(true));
        expect(store.getState().bookingHasErrored).toEqual(true);
    });


    test('Should dispatches correct bookingIsLoading', () => {
        store.dispatch(selectActions.bookingIsLoading(true));
        expect(store.getState().bookingIsLoading).toEqual(true);
    });

    test('Should dispatches correct bookingFetchDataSuccess', () => {
        const result = {
            type: 'BOOKING_FETCH_DATA_SUCCESS',
            booking: []
        }
        expect(store.dispatch(selectActions.bookingFetchDataSuccess([]))).toEqual(result);
    });
});
