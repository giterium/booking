import React from "react";
import { Booking } from "../src/views/Booking";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);
import "regenerator-runtime/runtime";
import {Calendar} from "../src/views/BookingCalendar";
import moment from "moment";



describe("Booking component", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            rooms: [{
                _id: 'enzymeOpenWindow',
                num: 23,
                building: 2,
                capacity: 2,
                cost: '100'
            }],
            booking: [{_id: '123', room: 'enzymeOpenWindow', cost: '200', fio: '123', startDate: moment(), endDate: moment().add(2,'days')}]
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should renders Booking', () => {
        const wrapper = mount(<Provider store={store}><Booking /></Provider>);
        expect(wrapper.exists('#wrapper')).toEqual(true);
    });

    it("should selected cell in Booking", () => {
        const wrapper = mount( <Provider store={store}><Booking /></Provider>)
        wrapper.find(".cell").first().simulate('click')
        wrapper.find(".cell").last().simulate('click')
        expect(wrapper.find('.selected')).toHaveLength(14);
    });

    it("should selected cell in Booking", () => {
        const wrapper = mount(<Provider store={store}><Booking /></Provider>);
        wrapper.find(".bookingCellFio").first().simulate('click')
        expect(wrapper.find('.cost').text()).toBe('200');
    });

    it("should selected cell in Booking", () => {
        const wrapper = mount( <Provider store={store}><Booking /></Provider>)
        wrapper.find(".cell").first().simulate('click')
        wrapper.find(".cell").last().simulate('click')
        expect(wrapper.find('.selected')).toHaveLength(14);
    });

    it("should alert error when startDate and endDate in editable booking equal", (done) => {
        jest.spyOn(window, 'alert').mockImplementation(() => {})
        const wrapper = mount( <Provider store={store}><Booking /></Provider>)
        wrapper.find(".bookingCellFio").first().simulate('click')
        const dateInput = wrapper.find(".endDatePicker").last();
        dateInput.simulate('change', {target: { value: moment().toDate() }});
        done();
        expect(window.alert).toBeCalledWith('Дата выезда и дата въезда должны различаться.');
    });


});