import {store} from '../src/configureStore';
import {isGoodRange} from "../src/utils/booking-utils";
import * as selectActions from "../src/actions/booking-actions";
import "regenerator-runtime/runtime";
import moment from "moment";

describe('Booking Helpers', () => {
    test('Should correct execute isGoodRange', () => {
        expect(isGoodRange(moment(), moment().add(13,'days'), 1)).toEqual(true);
    });

    test('Should correct execute isGoodRange when no good range', () => {
        store.dispatch(selectActions.createBooking({_id: '1234', room: '1', cost: '200', fio: '123', startDate: moment(), endDate: moment().add(2,'days')}));
        expect(isGoodRange(moment(), moment().add(13,'days'), 1)).toEqual(false);
    });
});
