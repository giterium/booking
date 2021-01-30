import React from "react";
import { Calendar } from "../src/views/BookingCalendar";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);
import "regenerator-runtime/runtime";
import {TypeRoom} from "../src/reducers/rooms-reducers";
import {TypeBooking} from "../src/reducers/booking-reducers";

describe("Booking component", () => {
    let store;
    let mountingDiv;

    beforeEach(() => {
        store = mockStore({
            rooms: [{
                _id: '233422323',
                num: 23,
                building: 2,
                capacity: 2,
                cost: '100'
            }]
        });

    });

    beforeEach(() => {
        mountingDiv = document.createElement('div');
        document.body.appendChild(mountingDiv);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render Booking component", () => {
        const props = {
            rooms: [{
                _id: '233422323',
                num: 23,
                building: 2,
                capacity: 2,
                cost: '100'
            }]
        };
        const component = render(<Provider store={store}><Calendar {...props} /></Provider>);
        expect(component).toMatchSnapshot();
    });
});