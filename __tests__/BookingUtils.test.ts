import {store} from '../src/configureStore';
import {isGoodRange, isBooking, timenull, isSelected, setCurrentBooking, checkBooking} from "../src/utils/booking-utils";
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


    test('Should correct execute isBooking when day no contains booking', () => {
        store.dispatch(selectActions.createBooking({_id: '1234', room: '1', cost: '200', fio: '123', startDate: moment(), endDate: moment().add(2,'days')}));
        expect(isBooking({date: timenull(moment().add(5,'days'))}, {_id: '1234'})).toEqual('');
    });

    test('Should correct execute isBooking when day no contains isFirstBooking', () => {
        store.dispatch(selectActions.createBooking({_id: '1234', room: '1', cost: '200', fio: '123', startDate: moment(), endDate: moment().add(2,'days')}));
        expect(isBooking({date: timenull(moment())}, {_id: '1'})).toContain('isFirstBooking');
    });

    test('Should correct execute isBooking when day no contains isLastBooking', () => {
        store.dispatch(selectActions.createBooking({_id: '1234', room: '1', cost: '200', fio: '123', startDate: moment(), endDate: moment().add(2,'days')}));
        expect(isBooking({date: timenull(moment().add(2,'days'))}, {_id: '1'})).toContain('isLastBooking');
    });

    test('Should correct execute isSelected when day contains selected', () => {
       const selected = {
           start:{day:timenull(moment()), room:'1'},
           end:{day:timenull(moment().add(2,'days')), room:'1'}
       }
       expect(isSelected({date: timenull(moment().add(2,'days'))}, {_id: '1'}, selected)).toContain('selected');
    });

    test('Should correct execute isSelected when day no contains selected', () => {
        const selected = {
            start:{day:timenull(moment()), room:'1'},
            end:{day:timenull(moment().add(2,'days')), room:'1'}
        }
        expect(isSelected({date: timenull(moment().add(3,'days'))}, {_id: '1'}, selected)).toEqual(expect.not.stringContaining('selected'));
    });

    test('Should correct execute checkBooking when startDate of selected more than endDate of selected', () => {
        store.dispatch(setCurrentBooking({_id: 'create', room: '1', cost: '200', fio: '123', startDate: moment(), endDate: moment().add(2,'days')}));
        expect(checkBooking(timenull(moment().add(3,'days')), timenull(moment()), {_id: '1'})).toEqual([timenull(moment()), timenull(moment().add(3,'days')), '']);
    });
});
