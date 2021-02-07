import React, {useEffect, useState, useContext}  from 'react';
import {TypeRoom} from "../reducers/rooms-reducers";
import {WindowContext} from './Booking';
import Modal from 'react-modal';
import {TableInput} from "../components/TableInput";
import {TableErrors} from "../components/TableErrors";
import {Button} from "../components/Button";
import {shallowEqual, useSelector, useDispatch} from "react-redux";
import styles from '../css/booking.module.css';
import moment, {Moment} from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import {EventBus} from "../events";
import {RootState} from "../reducers";
import {TypeBooking} from "../reducers/booking-reducers";
import {clearErrors} from "../actions/booking-actions";
import {setCurrentBooking, updateSelected} from "../utils/booking-utils";
import {checkBooking} from "../utils/checkBooking";
import {TypeSelected} from "../reducers/selected-reducers";

const modalStyles = {
    overlay: { zIndex: 100 },
    content : {top : '50%', left : '50%', right : 'auto', bottom : 'auto', marginRight : '-50%', boxShadow : '0 0 10px rgba(0,0,0,0.5)', width : '500px', transform  : 'translate(-50%, -50%)'}
}

const customStyles = {
    control: (styles, isFocused) => ({ ...styles, backgroundColor: 'white', boxShadow: isFocused ? '' : '', border: isFocused ? '0px solid grey' : '0px solid grey' }),
    container: (styles, isFocused) => ({ ...styles, backgroundColor: 'white', border: isFocused ? '1px solid #bfbfbf' : '1px solid #bfbfbf' }),
    singleValue: (styles, isFocused) => ({ ...styles, width: '300px' }),
}

interface TypeRoomsOptions {
    label: number;
    value: string;
}

type ModalProps = {
    //onChangeBooking: (startDate: Moment | Date, endDate: Moment | Date, room: string) => any;
    onActionDelete: (id: string) => void;
    onActionClose?: () => void;
    onActionModal: (cost: string, fio: string, room: string, startDate: Moment | Date, endDate: Moment | Date) => void;
}

export const BookingModal = (props: ModalProps) => {
    const errors: any = useSelector((state: RootState) => state.errors, shallowEqual)
    const rooms: TypeRoom[] = useSelector((state: RootState) => state.rooms, shallowEqual)
    const booking: TypeBooking[] = useSelector((state: RootState) => state.booking, shallowEqual)
    const selected: TypeSelected = useSelector((state: RootState) => state.selected, shallowEqual)
    const currentBooking: TypeBooking = useSelector((state: RootState) => state.currentBooking, shallowEqual)

    const [fio, setFio] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [cost, setCost] = useState('0')
    const [room, setRoom] = useState('')

    const [roomsOptions, setRoomsOptions] = useState([])
    const [defRoomsOptions, setDefRoomsOptions] = useState([])
    const dispatch = useDispatch();
    const { openWindow, setOpenWindow } = useContext(WindowContext)
    EventBus.subscribe('bookingCloseWindow', () => closeWindow())

    const closeWindow = () => {
        if(setOpenWindow)
            setOpenWindow(false)
        if(props.onActionClose)
            props.onActionClose()
    }

    useEffect(() => {
        const roomsOptions: TypeRoomsOptions[] = []
        rooms.map((room) => {
            roomsOptions.push({label: room.num, value: room._id})
        });
        setRoomsOptions(roomsOptions)
    }, [rooms])

    useEffect(() => {
        if(openWindow && currentBooking) {
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
    }, [openWindow, currentBooking])

    useEffect(() => {
        if (selected.end.room) {
            const curRoom = rooms.filter((item) => item._id == selected.start.room)[0]
            if (typeof curRoom != 'undefined') {
                const cost = Math.abs(moment(selected.start.day).diff(moment(selected.end.day), "days") * parseInt(curRoom.cost))
                dispatch(setCurrentBooking({
                    _id: 'create',
                    cost: cost + '',
                    fio: !openWindow ? '' : fio,
                    room: selected.start.room,
                    startDate: selected.start.day.toDate(),
                    endDate: moment(selected.end.day).toDate()
                }))
                dispatch(updateSelected(selected))
                dispatch(clearErrors())
                setOpenWindow(true)
            }
        }
    }, [selected])

    const changeBooking = (newStartDate, newEndDate, room) => {
        const result = checkBooking(newStartDate, newEndDate, room)
        if(typeof result != 'undefined') {
            if (result === true) {
                const curRoom = rooms.filter((item) => item._id == room)[0];
                setStartDate(newStartDate)
                setEndDate(newEndDate)
                setRoom(room)
                setDefRoomsOptions({
                    label: curRoom.num,
                    value: room
                })
                const cost = Math.abs(moment(startDate).diff(moment(endDate), "days") * parseInt(curRoom.cost))
                setCost(cost+'')
            }
            else {
                const curRoom = rooms.filter((item) => item._id == result[2])[0]
                setStartDate(result[0])
                setEndDate(result[1])
                setRoom(result[2])
                setDefRoomsOptions({
                    label: curRoom.num,
                    value: result[2]
                })
                const cost = Math.abs(moment(startDate).diff(moment(endDate), "days") * parseInt(curRoom.cost))
                setCost(cost+'')
            }
        }
    }

    return <div id="root">
        <Modal
            isOpen={rooms[0] && rooms[0]._id == 'enzymeOpenWindow' ? true : openWindow}
            style={modalStyles}
            ariaHideApp={false}
        >
            <h2 className="titleModal">{(typeof currentBooking == 'undefined' || currentBooking._id == 'create') ? 'Adding a reservation' : currentBooking.fio} </h2>
            <br />
            <table className={styles.tableModal}>
                <tbody>
                    <TableInput title="Name" className="usualInput" name="fio" changeUpdate={(e) => setFio(e.target.value)} defaultValue={fio} />
                    <TableErrors errors={errors && errors.fio ? errors.fio : ''} />

                    <tr><td  className={styles.cellModal}>Date of entry: </td><td>
                        <DatePicker
                            className="startDatePicker"
                            locale="ru"
                            selected={new Date(startDate)}
                            onChange={date => changeBooking(date, endDate, room)}
                            dateFormat="dd.MM.yyyy"
                        />
                    </td></tr>
                    <TableErrors errors={errors && errors.startDate ? errors.startDate : ''} />

                    <tr><td className={styles.cellModal}>Date of departure: </td><td>
                        <DatePicker
                            className="endDatePicker"
                            locale="ru"
                            selected={new Date(endDate)}
                            onChange={date => changeBooking(startDate, date, room)}
                            dateFormat="dd.MM.yyyy"
                        />
                    </td></tr>
                    <TableErrors errors={errors && errors.endDate ? errors.endDate : ''} />

                    <tr><td className={styles.cellModal}>Room: </td><td>
                        <div style={{width: '100px'}}>
                            <Select
                                classNamePrefix='list'
                                className='listRooms'
                                styles={customStyles}
                                value={defRoomsOptions}
                                onChange={(e)=>changeBooking(startDate, endDate, e.value)}
                                name="id_room"
                                options={roomsOptions}
                            />
                        </div>
                    </td></tr>
                    <TableErrors errors={errors && errors.room ? errors.room : ''} />

                    <tr><td className={styles.cellModal}>
                        Cost: </td><td><span className="cost">{cost}</span> $
                    </td></tr>
                </tbody>
            </table>

            <Button onClick={() => props.onActionDelete((currentBooking ? currentBooking._id : ''))} className={
                ((typeof currentBooking == 'undefined' || currentBooking._id == 'create') ? 'hidden' : '')+
                ' deleteButton '+styles.deleteButton
            } title="Delete" />

            <div className={styles.modalBoxButton}>
                <Button
                    className="actionButton"
                    onClick={() => {props.onActionModal(cost, fio, room, startDate, endDate)}}
                    title={(typeof currentBooking == 'undefined' || currentBooking._id == 'create') ? 'Add' : 'Save'}
                />
                <Button onClick={() => closeWindow()} className="closeButton" title="Cancel" />
            </div>
        </Modal>
    </div>
}