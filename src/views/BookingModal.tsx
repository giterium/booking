import React, {useEffect, useState, useContext, useMemo}  from 'react';
import {TypeRoom} from "../reducers/rooms-reducers";
import {WindowContext} from './Booking';
import Modal from 'react-modal';
import {TypeDay} from "./BookingShahmatka";
import {TableInput} from "../components/TableInput";
import {TableErrors} from "../components/TableErrors";
import {shallowEqual, useSelector, useDispatch} from "react-redux";
import {createBooking, updateBooking, clearErrors, deleteBooking} from "../actions/booking-actions";
import styles from '../css/booking.module.css';
import moment from "moment";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import {EventBus} from "../events";
import {isGoodDiapazon} from "../helpers/booking-helpers";
import {TypeBooking} from "../reducers/booking-reducers";
//import ru from 'date-fns/locale/ru';
//registerLocale('ru', ru);

const modalStyles = {
    overlay: {
        zIndex: 100
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        boxShadow            : '0 0 10px rgba(0,0,0,0.5)',
        width            : '500px',
        transform             : 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root')

const customStyles = {
    control: (styles, isFocused) => ({ ...styles, backgroundColor: 'white', boxShadow: isFocused ? '' : '', border: isFocused ? '0px solid grey' : '0px solid grey' }),
    container: (styles, isFocused) => ({ ...styles, backgroundColor: 'white', border: isFocused ? '1px solid #bfbfbf' : '1px solid #bfbfbf' }),
    singleValue: (styles, isFocused) => ({ ...styles, width: '300px' }),
}

interface TypeRoomsOptions {
    label: number;
    value: string;
}

export const BookingModal = () => {
    const errors: any = useSelector((state: any) => state.errors, shallowEqual);
    const rooms: TypeRoom[] = useSelector((state: any) => state.rooms, shallowEqual);
    const booking: TypeBooking[] = useSelector((state: any) => state.booking, shallowEqual);

    const [fio, setFio] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [cost, setCost] = useState<string>('');
    const [room, setRoom] = useState<string>('');
    const [roomsOptions, setRoomsOptions] = useState<TypeRoomsOptions[]>([]);
    const [defRoomsOptions, setDefRoomsOptions] = useState<any>([]);
    const dispatch: any = useDispatch();
    const { openWindow, setOpenWindow, currentBooking, setCurrentBooking, selected, setSelected } = useContext(WindowContext);
    EventBus.subscribe('bookingUpdatedAlert', (mode) => closeWindow(mode))

    useMemo(() => {
        let roomsOptions: TypeRoomsOptions[] = [];
        rooms.map((room) => {
            roomsOptions.push({label: room.num, value: room._id})
        });
        setRoomsOptions(roomsOptions);
    },[rooms]);

    const closeWindow = (mode) => {
        if(mode == 2) {
            setOpenWindow(false);
        }
        if(mode == 1) {
            setOpenWindow(false);
        }
    }

    const actionDelete = () => {
        if(confirm('Delete?'))
            dispatch(deleteBooking(currentBooking._id, booking.findIndex(item => item._id == currentBooking._id)));
    }

    const actionModal = () => {
        if(currentBooking._id == 'create') {
            dispatch(createBooking({
                _id: currentBooking._id,
                cost: currentBooking.cost,
                fio: fio,
                room: currentBooking.room,
                startDate: currentBooking.startDate,
                endDate: currentBooking.endDate
            }));
        }
        else {
            dispatch(updateBooking({
                _id: currentBooking._id,
                cost: currentBooking.cost,
                fio: fio,
                room: currentBooking.room,
                startDate: currentBooking.startDate,
                endDate: currentBooking.endDate
            }, booking.findIndex(item => item._id == currentBooking._id)));
        }
    }

    const changeRoom = (e) => {
        //alert(isGoodDiapazon(moment(startDate), moment(endDate), e.value, booking))
        if(
            currentBooking
            &&
            (
                (
                    selected && selected.end && selected.start && selected.start.day && selected.end.day
                    &&
                    currentBooking._id == 'create'
                    &&
                    isGoodDiapazon(moment(startDate), moment(endDate), e.value, booking)
                )
                ||
                (
                    currentBooking._id != 'create'
                    &&
                    isGoodDiapazon(moment(startDate), moment(endDate), e.value, booking, currentBooking._id)
                )
            )
        ) {
            const room = rooms.filter((room) => room._id == e.value)[0];
            if(currentBooking._id == 'create' && selected && selected.end && selected.start && selected.start.day && selected.end.day) {
                setSelected({
                    start: {day: moment(startDate), room: e.value},
                    end: {day: moment(endDate), room: e.value}
                });

                setCurrentBooking({
                    _id: currentBooking._id,
                    cost: Math.abs(selected.end.day.diff(selected.start.day, "days") * parseInt(room.cost)),
                    fio: fio,
                    room: e.value,
                    startDate: currentBooking.startDate,
                    endDate: currentBooking.endDate
                });
            }
            else {
                setCurrentBooking({
                    _id: currentBooking._id,
                    cost: Math.abs(moment(endDate).diff(moment(startDate), "days") * parseInt(room.cost)),
                    fio: fio,
                    room: e.value,
                    startDate: currentBooking.startDate,
                    endDate: currentBooking.endDate
                });
            }

            setRoom(e.value);
            setDefRoomsOptions({
                label: room.num,
                value: currentBooking.room
            })
        }
        else {
            setDefRoomsOptions({
                label: rooms.filter(room => room._id == currentBooking.room)[0].num,
                value: currentBooking.room
            })
            alert('Этот номер в это время занят.')
        }
    }

    const closeModal = () => {
        setOpenWindow(false);
    }

    useEffect(() => {
        if(openWindow) {
            setDefRoomsOptions({
                label: rooms.filter(room => room._id == currentBooking.room)[0].num,
                value: currentBooking.room
            })
            setFio(currentBooking.fio)
            setStartDate(currentBooking.startDate)
            setEndDate(currentBooking.endDate)
            setCost(currentBooking.cost)
            setRoom(currentBooking.room)
        }
        else {
            dispatch(clearErrors())
        }
    }, [openWindow]);

    useEffect( ()=> {
        if(selected && selected.end && selected.start && selected.start.day && selected.end.day && room) {
            const curRoom = rooms.filter((item) => item._id == room)[0];
            const cost = Math.abs(selected.end.day.diff(selected.start.day, "days") * parseInt(curRoom.cost));
            setCurrentBooking({
                _id: currentBooking._id,
                fio: fio,
                cost: cost,
                room: currentBooking.room,
                startDate: selected.start.day.format('YYYY-MM-DD'),
                endDate: selected.end.day.format('YYYY-MM-DD')
            });
            setCost(cost+'');
        }
    },[room, selected])


    useEffect( ()=> {
        if(currentBooking._id != 'create') {
            const curRoom = rooms.filter((item) => item._id == room)[0];
            const cost = Math.abs(moment(startDate).diff(moment(endDate), "days") * parseInt(curRoom.cost));
            setCost(cost+'');
        }
    },[room, startDate, endDate])

    useEffect(() => {
        if ((selected.start.day && selected.end.day && currentBooking._id == 'create') || currentBooking._id != 'create') {
            if(moment(startDate).milliseconds(0).second(0).minutes(0).hours(0).isSame(moment(endDate).milliseconds(0).second(0).minutes(0).hours(0))) {
                if(currentBooking._id == 'create') {
                    if (selected && selected.start && selected.start.day && selected.end && selected.end.day) {
                        setStartDate(selected.start.day.toDate())
                        setEndDate(selected.end.day.toDate())
                    }
                }
                else {
                    setStartDate(new Date(currentBooking.startDate))
                    setEndDate(new Date(currentBooking.endDate))
                }
                alert('Дата выезда и дата въезда должны различаться.')
            }
            else if(moment(startDate).diff(endDate, 'days') < 0 && (
                isGoodDiapazon(moment(startDate), moment(endDate), room, booking)
                ||
                (
                    currentBooking._id != 'create'
                    &&
                    isGoodDiapazon(moment(startDate), moment(endDate), room, booking, currentBooking._id)
                )
            )
            ) {
                if(currentBooking._id == 'create') {
                    setSelected({
                        start: {day: moment(startDate).milliseconds(0).second(0).minutes(0).hours(0), room: room},
                        end: {day: moment(endDate).milliseconds(0).second(0).minutes(0).hours(0), room: room}
                    });
                }
                else {
                    const curRoom = rooms.filter((item) => item._id == room)[0];
                    const cost = Math.abs(moment(startDate).diff(moment(endDate), "days") * parseInt(curRoom.cost));

                    setCurrentBooking({
                        _id: currentBooking._id,
                        fio: fio,
                        cost: cost,
                        room: currentBooking.room,
                        startDate: moment(startDate).format('YYYY-MM-DD'),
                        endDate: moment(endDate).format('YYYY-MM-DD')
                    });
                }
            }
            else if(isGoodDiapazon(moment(endDate), moment(startDate), room, booking)) {
                setSelected({
                    start: {day: moment(endDate).milliseconds(0).second(0).minutes(0).hours(0), room: room},
                    end: {day: moment(startDate).milliseconds(0).second(0).minutes(0).hours(0), room: room}
                })
                let date1 = startDate;
                setStartDate(endDate);
                setEndDate(date1);

            }
            else {
                if(currentBooking._id == 'create' && selected && selected.start.day && selected.end.day) {
                    setStartDate(new Date(selected.start.day.format('YYYY-MM-DD')));
                    setEndDate(new Date(selected.end.day.format('YYYY-MM-DD')));
                }
                else {
                    setStartDate(new Date(currentBooking.startDate));
                    setEndDate(new Date(currentBooking.endDate));
                }
                alert('На этот дипазон уже назначено бронирование.')
            }
        }
    }, [startDate, endDate]);

    return <div>
        <Modal
            isOpen={openWindow}
            style={modalStyles}
        >
            <h2 className="titleModal">{(currentBooking._id == 'create') ? 'Adding a reservation' : currentBooking.fio} </h2>
            <br />
            <table className="tableUpdateDept">
                <TableInput title="Name" className="usualInput" name="fio" changeUpdate={(e) => setFio(e.target.value)} defaultValue={fio} />
                <TableErrors errors={errors.fio} />

                <tr><td className={styles.cellModal}>Date of entry: </td><td>
                    <DatePicker
                        locale="ru"
                        selected={new Date(startDate)}
                        onChange={date => {
                            if(isGoodDiapazon(moment(date), moment(endDate), room, booking) && moment(date).diff(endDate, 'days') < 0) {
                                setStartDate(date)
                            }
                            else {
                                if(moment(date).diff(endDate, 'days') > 0)
                                    alert('Дата въезда должна быть меньше даты выезда')
                                else {
                                    alert('На этот диапазон уже назначено бронирование')
                                }
                            }
                        }
                        }
                        dateFormat="dd.MM.yyyy"

                    />
                </td></tr>
                <TableErrors errors={errors.startDate} />

                <tr><td className={styles.cellModal}>Date of departure: </td><td>
                    <DatePicker
                        locale="ru"
                        selected={new Date(endDate)}
                        onChange={date => {
                            if(isGoodDiapazon(moment(startDate), moment(date), room, booking) && moment(startDate).diff(date, 'days') < 0) {
                                setEndDate(date)
                            }
                            else {
                                if(moment(startDate).diff(date, 'days') > 0)
                                    alert('Дата выезда должна быть больше даты въезда')
                                else {
                                    alert('На этот диапазон уже назначено бронирование')
                                }
                            }
                        }
                        }
                        dateFormat="dd.MM.yyyy"
                    />
                </td></tr>
                <TableErrors errors={errors.endDate} />

                <tr><td className={styles.cellModal}>Room: </td><td>
                    <div style={{width: '100px'}}>
                        <Select styles={customStyles}  value={defRoomsOptions} onChange={(e)=>changeRoom(e)} name="id_room" options={roomsOptions} />
                    </div>
                </td></tr>
                <TableErrors errors={errors.room} />

                <tr><td className={styles.cellModal}>Cost: </td><td>{cost} $</td></tr>

                <br /><br /><br /><br /><br />
            </table>

            <button onClick={actionDelete}>Delete</button>
            <div className={styles.modalBoxButton} style={{paddingTop: '10px'}}>
                <button onClick={actionModal}>{(currentBooking._id == 'create') ? 'Add' : 'Save'}</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </Modal>
    </div>;
}