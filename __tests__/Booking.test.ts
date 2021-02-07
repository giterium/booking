import React from "react";
import { Booking } from "../src/views/Booking";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);
import "regenerator-runtime/runtime";
import moment from "moment";
import {momentNullDate, timenull} from "../src/utils/booking-utils";
import {Calendar} from "../src/views/BookingCalendar";

const sleep = m => new Promise(r => setTimeout(r, m))

describe("Booking component", () => {
    let store;
    let storeForSnapshot;
    let propsForSnapshot;

    beforeEach(() => {
        storeForSnapshot = mockStore({
            rooms: [{
                _id: 'enzymeOpenWindow',
                num: 23,
                building: 2,
                capacity: 2,
                cost: '100'
            }],
            booking: [{_id: '123', room: 'enzymeOpenWindow', cost: '200', fio: '123', startDate: moment("2021-01-01").toDate(), endDate: moment("2021-01-01").add(2,'days').toDate()}],
            selected: {
                start:{day:momentNullDate(), room:''},
                end:{day:momentNullDate(), room:''}
            },
        })

        store = mockStore({
            rooms: [{
                _id: 'enzymeOpenWindow',
                num: 23,
                building: 2,
                capacity: 2,
                cost: '100'
            }],
            booking: [{_id: '123', room: 'enzymeOpenWindow', cost: '200', fio: '123', startDate: moment().toDate(), endDate: moment().add(2,'days').toDate()}],
            selected: {
                start:{day:momentNullDate(), room:''},
                end:{day:momentNullDate(), room:''}
            },
        })

        propsForSnapshot = {
            startDate: timenull(moment("2021-01-01")),
            endDate: timenull(moment("2021-01-01").add(13,'days')),
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("should snapshot Booking ", () => {
        const wrapper = mount(<Provider store={storeForSnapshot}><Booking {...propsForSnapshot} /></Provider>)
        expect(wrapper.debug()).toMatchSnapshot()
    })

    it('should renders Booking', () => {
        const wrapper = mount(<Provider store={store}><Booking /></Provider>)
        expect(wrapper.exists('#wrapper')).toEqual(true)
    })

    it("should cost for booking in Booking", () => {
        const wrapper = mount(<Provider store={store}><Booking /></Provider>)
        wrapper.find(".bookingCellFio").first().simulate('click')
        setTimeout(()=>
            expect(wrapper.update().find('.cost').text()).toBe('200')
        , 1000)
    });

    setTimeout(()=> {
        it("should selected cell in Booking", () => {
            const wrapper = mount( <Provider store={store}><Booking /></Provider>)
            wrapper.find(".cell").at(5).simulate('click')
            wrapper.find(".cell").last().simulate('click')
            setTimeout(()=>
                expect(wrapper.update().find('.selected')).toHaveLength(9)
            , 1000)
        })
    }, 1000)

    setTimeout(()=> {
        it("should alert error when startDate and endDate in editable booking equal", (done) => {
            jest.spyOn(window, 'alert').mockImplementation(() => {})
            const wrapper = mount( <Provider store={store}><Booking /></Provider>)
            wrapper.find(".bookingCellFio").first().simulate('click')
            setTimeout(()=> {
                const dateInput = wrapper.find(".endDatePicker").last()
                dateInput.simulate('change', {target: {value: moment().toDate()}})
                done()
                setTimeout(()=> {
                    expect(window.alert).toBeCalledWith('Дата выезда и дата въезда должны различаться.')
                }, 1000)
            }, 1000)
        })
    }, 2000)


});