import React, { useContext } from "react";
import { BookingModal } from "../src/views/BookingModal";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);
import "regenerator-runtime/runtime";
import {momentNullDate} from "../src/utils/booking-utils";
import {Booking} from "../src/views/Booking";

describe("Booking Modal component", () => {
    let store;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState")
    useStateSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        store = mockStore({
            rooms: [{
                _id: 'enzymeOpenWindow',
                num: 22,
                building: 2,
                capacity: 2,
                cost: '100'
            },{
                _id: '123',
                num: 33,
                building: 2,
                capacity: 2,
                cost: '200'
            }],
            selected: {
                start:{day:momentNullDate(), room:''},
                end:{day:momentNullDate(), room:''}
            },
            currentBooking: {}
        });

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should snapshot BookingModal ", () => {
        const wrapper = mount(<Provider store={store}><BookingModal /></Provider>);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('renders modal when open flag is true', () => {
        const wrapper = mount(
            <Provider store={store}><BookingModal /></Provider>
        );
        expect(wrapper.find('.titleModal').exists()).toEqual(true);
    });

    it("should call onActionClose method", () => {
        const mockCallBack = jest.fn();
        const wrapper = mount( <Provider store={store}><BookingModal onActionClose={mockCallBack} /></Provider>)
        expect(mockCallBack.mock.calls.length).toBe(0);
        wrapper.find(".closeButton").last().simulate("click");
        expect(mockCallBack.mock.calls.length).toBe(1);
    });

    it("should call onActionClose method", () => {
        const mockCallBack = jest.fn();
        const wrapper = mount( <Provider store={store}><BookingModal onActionModal={mockCallBack} /></Provider>)
        expect(mockCallBack.mock.calls.length).toBe(0);
        wrapper.find(".actionButton").last().simulate("click");
        expect(mockCallBack.mock.calls.length).toBe(1);
    });

    it('datepicker calls the onChange Event in StartDate', done => {
        const mockCallBack = jest.fn();
        const wrapper = mount( <Provider store={store}><BookingModal onChangeBooking={mockCallBack} /></Provider>)
        const dateInput = wrapper.find(".startDatePicker").last();
        dateInput.simulate('change', {target: { value: "2018-01-04" }});
        done();
        expect(mockCallBack.mock.calls.length).toBe(1);
    });

    it('datepicker calls the onChange Event in EndDate', done => {
        const mockCallBack = jest.fn();
        const wrapper = mount( <Provider store={store}><BookingModal onChangeBooking={mockCallBack} /></Provider>)
        const dateInput = wrapper.find(".endDatePicker").last();
        dateInput.simulate('change', {target: { value: "2018-01-04" }});
        done();
        expect(mockCallBack.mock.calls.length).toBe(1);
    });

    it("should call onActionDelete method", () => {
        const mockCallBack = jest.fn();
        const wrapper = mount( <Provider store={store}><BookingModal onActionDelete={mockCallBack} /></Provider>)
        expect(mockCallBack.mock.calls.length).toBe(0);
        wrapper.find(".deleteButton").last().simulate("click");
        expect(mockCallBack.mock.calls.length).toBe(1);
    });

    it("should render Cost default value", () => {
        const wrapper = mount( <Provider store={store}><BookingModal /></Provider>)
        const errorBox = wrapper.find(".cost");
        expect(errorBox.text()).toBe('0');
    });

});