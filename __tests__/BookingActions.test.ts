import {store} from '../src/configureStore';
import "regenerator-runtime/runtime";
import * as selectActions from "../src/actions/booking-actions";
import moment from "moment";

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

    test('Should dispatches correct updateBooking', () => {
        store.dispatch(selectActions.deleteBooking(0));
        expect(store.getState().booking.length).toEqual(0);
    });
});
