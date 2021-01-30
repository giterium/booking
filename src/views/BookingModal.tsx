import React, {useEffect, useState, useContext, useMemo}  from 'react';
import {TypeRoom} from "../reducers/rooms-reducers";
import {WindowContext} from './Booking';
import Modal from 'react-modal';
import {TableInput} from "../components/TableInput";
import {TableErrors} from "../components/TableErrors";
import {Button} from "../components/Button";
import {shallowEqual, useSelector} from "react-redux";
import styles from '../css/booking.module.css';
import moment, {Moment} from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import {EventBus} from "../events";
import {RootState} from "../reducers";

const modalStyles = {
    overlay: { zIndex: 100 },
    content : {top : '50%', left : '50%', right : 'auto', bottom : 'auto', marginRight : '-50%', boxShadow : '0 0 10px rgba(0,0,0,0.5)', width : '500px', transform  : 'translate(-50%, -50%)'}
};

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
    onChangeBooking: (startDate: Moment | Date, endDate: Moment | Date, room: string) => any;
    onActionDelete: (id: string) => void;
    onActionModal: (cost: string, fio: string, room: string, startDate: Moment | Date, endDate: Moment | Date) => void;
};

export const BookingModal = (props: ModalProps) => {
    const errors: any = useSelector((state: RootState) => state.errors, shallowEqual);
    const rooms: TypeRoom[] = useSelector((state: RootState) => state.rooms, shallowEqual);

    const [fio, setFio] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [cost, setCost] = useState<string>('');
    const [room, setRoom] = useState<string>('');

    const [roomsOptions, setRoomsOptions] = useState<TypeRoomsOptions[]>([]);
    const [defRoomsOptions, setDefRoomsOptions] = useState<TypeRoomsOptions>([]);

    const { openWindow, setOpenWindow, currentBooking } = useContext(WindowContext);
    EventBus.subscribe('bookingCloseWindow', () => closeWindow())

    useMemo(() => {
        const roomsOptions: TypeRoomsOptions[] = [];
        rooms.map((room) => {
            roomsOptions.push({label: room.num, value: room._id})
        });
        setRoomsOptions(roomsOptions);
    }, [rooms]);

    useEffect(() => {
        Modal.setAppElement('#root')
    }, []);

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
    }, [openWindow]);

    const closeWindow = () => {
        setOpenWindow(false);
    }

    const changeBooking = (newStartDate, newEndDate, room) => {
        let result = props.onChangeBooking(newStartDate, newEndDate, room);
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
                const cost = Math.abs(moment(startDate).diff(moment(endDate), "days") * parseInt(curRoom.cost));
                setCost(cost+'');
            }
            else {
                const curRoom = rooms.filter((item) => item._id == result[2])[0];
                setStartDate(result[0])
                setEndDate(result[1])
                setRoom(result[2])
                setDefRoomsOptions({
                    label: curRoom.num,
                    value: result[2]
                })
                const cost = Math.abs(moment(startDate).diff(moment(endDate), "days") * parseInt(curRoom.cost));
                setCost(cost+'');
            }
        }
    }

    return <div>
        <Modal
            isOpen={openWindow}
            style={modalStyles}
            ariaHideApp={false}
        >
            <h2 className="titleModal">{(currentBooking._id == 'create') ? 'Adding a reservation' : currentBooking.fio} </h2>
            <br />
            <table className={styles.tableModal}>
                <TableInput title="Name" className="usualInput" name="fio" changeUpdate={(e) => setFio(e.target.value)} defaultValue={fio} />
                <TableErrors errors={errors.fio} />

                <tr><td className={styles.cellModal}>Date of entry: </td><td>
                    <DatePicker
                        locale="ru"
                        selected={new Date(startDate)}
                        onChange={date => changeBooking(date, endDate, room)}
                        dateFormat="dd.MM.yyyy"
                    />
                </td></tr>
                <TableErrors errors={errors.startDate} />

                <tr><td className={styles.cellModal}>Date of departure: </td><td>
                    <DatePicker
                        locale="ru"
                        selected={new Date(endDate)}
                        onChange={date => changeBooking(startDate, date, room)}
                        dateFormat="dd.MM.yyyy"
                    />
                </td></tr>
                <TableErrors errors={errors.endDate} />

                <tr><td className={styles.cellModal}>Room: </td><td>
                    <div style={{width: '100px'}}>
                        <Select
                            styles={customStyles}
                            value={defRoomsOptions}
                            onChange={(e)=>changeBooking(startDate, endDate, e.value)}
                            name="id_room"
                            options={roomsOptions}
                        />
                    </div>
                </td></tr>
                <TableErrors errors={errors.room} />

                <tr><td className={styles.cellModal}>
                    Cost: </td><td>{cost} $
                </td></tr>
            </table>

            {
                (currentBooking._id == 'create') ? '' :
                <Button onClick={() => props.onActionDelete(currentBooking._id)} className={styles.deleteButton} title="Delete" />
            }

            <div className={styles.modalBoxButton}>
                <Button onClick={() => props.onActionModal(cost, fio, room, startDate, endDate)} title={(currentBooking._id == 'create') ? 'Add' : 'Save'} />
                <Button onClick={() => closeWindow()} title="Cancel" />
            </div>
        </Modal>
    </div>
}