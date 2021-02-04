import React from "react";
import { Calendar } from "../src/views/BookingCalendar";
import "regenerator-runtime/runtime";
import {timenull, momentNullDate} from "../src/utils/booking-utils";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);
import moment from "moment";

describe("Booking Calendar component", () => {
    let store;
    let props;
    const mockOnClickBooking = jest.fn();

    beforeEach(() => {
        store = mockStore({
            rooms: [{
                _id: 'enzymeOpenWindow',
                num: 23,
                building: 2,
                capacity: 2,
                cost: '100'
            }],
            booking: [],
            selected: {
                start:{day:momentNullDate(), room:''},
                end:{day:momentNullDate(), room:''}
            },
            currentBooking: {}
        });
        props = {
            onClickBooking: mockOnClickBooking,
            startDate: timenull(moment()),
            endDate: timenull(moment().add(13,'days')),
        };
    });

    it("should render Booking Calendar component", () => {
        //const props = {rooms};
        const wrapper = mount(<Provider store={store}><Calendar {...props} /></Provider>);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should render roomRow", () => {
        const wrapper = mount(<Provider store={store}><Calendar {...props} /></Provider>);
        expect(wrapper.find(".roomRow")).toHaveLength(1);
    });
/*
    it("should call onChangeSelected", () => {
        const wrapper = mount(<Provider store={store}><Calendar {...props} /></Provider>);
        wrapper.find(".cell").at(5).simulate('click')
        wrapper.find(".cell").last().simulate('click')
        expect(mockOnChangeSelected.mock.calls.length).toBe(1);
    });
 */

    it("should call onClickBooking", () => {
        const wrapper = mount(<Provider store={store}><Calendar {...props} /></Provider>);
        wrapper.find(".bookingCellFio").first().simulate('click')
        expect(mockOnClickBooking.mock.calls.length).toBe(1);
    });


});