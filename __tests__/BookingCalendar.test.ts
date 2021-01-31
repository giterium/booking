import React from "react";
import { Calendar } from "../src/views/BookingCalendar";
import "regenerator-runtime/runtime";
import {timenull} from "../src/helpers/booking-helpers";
import moment from "moment";

describe("Booking Calendar component", () => {
    let rooms = [{
        _id: '233422323',
        num: 23,
        building: 2,
        capacity: 2,
        cost: '100'
    }];

    const mockOnChangeSelected = jest.fn();
    const mockOnClickBooking = jest.fn();
    const props = {
        rooms,
        booking: [{_id: '123', fio: '123'}],
        onChangeSelected: mockOnChangeSelected,
        onClickBooking: mockOnClickBooking,
        startDate: timenull(moment()),
        endDate: timenull(moment().add(13,'days')),
        selected: {
            start:{day:false, room:false},
            end:{day:false, room:false}
        }
    };

    it("should render Booking Calendar component", () => {
        const props = {rooms};
        const wrapper = render(<Calendar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render roomRow", () => {
        const wrapper = mount(<Calendar {...props} />);
        expect(wrapper.find(".roomRow")).toHaveLength(1);
    });

    it("should call onChangeSelected", () => {
        const wrapper = mount(<Calendar {...props} />);
        wrapper.find(".cell").first().simulate('click')
        wrapper.find(".cell").last().simulate('click')
        expect(mockOnChangeSelected.mock.calls.length).toBe(1);
    });

    it("should call onChangeSelected", () => {
        const wrapper = mount(<Calendar {...props} />);
        wrapper.find(".bookingCellFio").first().simulate('click')
        expect(mockOnClickBooking.mock.calls.length).toBe(1);
    });
});