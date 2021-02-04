import React, {useEffect, useState}  from 'react';
import {useDispatch, shallowEqual, useSelector} from 'react-redux';
import {TypeRoom} from "../reducers/rooms-reducers";
import moment, {Moment} from 'moment';
import styles from '../css/booking.module.css';
import {Button} from "../components/Button";
import {TypeBooking} from "../reducers/booking-reducers";
import {TypeSelected} from "../reducers/selected-reducers";
import {timenull, isSelected, updateSelected, clickDayRoom} from "../utils/booking-utils";
import {RootState} from "../reducers";

export interface TypeDay {
    date: Date;
    display: Date;
}

type CalendarProps = {
    onClickBooking: (id: string) => void;
    startDate: Date | Moment;
    endDate: Date | Moment;
};

export const Calendar = (props : CalendarProps) => {
    const selected: TypeSelected = useSelector((state: RootState) => state.selected, shallowEqual);
    const booking: TypeBooking[] = useSelector((state: RootState) => state.booking, shallowEqual);
    const rooms: TypeRoom[] = useSelector((state: RootState) => state.rooms, shallowEqual);
    const [startDate, setStartDate] = useState(props.startDate);
    const [endDate, setEndDate] = useState(props.endDate);
    const [daysList, setDaysList] = useState([]);
    const dispatch = useDispatch();

    const getBookingInfo = (day, room, field) => {
        for(const curBooking of booking) {
            if (
                curBooking.room == room._id
                &&
                moment(timenull(curBooking.startDate)).diff(timenull(day.date)) == 0
            ) {
                return curBooking[field];
            }
        }
        return '';
    }

    const getWidthFio = (day, room) => {
        let duration = 0;
        for(const curBooking of booking) {
            if (
                curBooking.room == room._id
                &&
                moment(timenull(curBooking.startDate)).diff(timenull(day.date)) == 0
            ) {
                duration = moment(timenull(curBooking.endDate)).diff(moment(timenull(curBooking.startDate)), 'days');
                break;
            }
        }
        if(duration == 1)
            return 50 + 'px';
        else
            return 100*duration-50+'px';
    }

    const NextWeek = () => {
        setStartDate(startDate.clone().add(7, 'days'));
        setEndDate(endDate.clone().add(7, 'days'));
    };

    const PrevWeek = () => {
        setStartDate(startDate.clone().subtract(7, 'days'));
        setEndDate(endDate.clone().subtract(7, 'days'));
    };

    const clickBooking = (id) => {
        if(!selected.start.room) {
            props.onClickBooking(id);
        }
    }

    useEffect(() => {
        dispatch(updateSelected(selected))
    }, [selected]);

    useEffect(() => {
        const list:TypeDay[] = [];
        const current = startDate.clone();
        while(current <= endDate){
            list.push({
                date:current.clone(),
                display:current.format('DD.MM')
            });
            current.add(1, 'days');
        }
        setDaysList((prev: TypeDay[]) => prev = list)

    }, [startDate, setEndDate]);

    return <div>
        <div className={styles.shahmatkaBox}>
            <div className={styles.headerRow}>
                <div className={styles.headerCell}></div>
                {daysList.map((day:TypeDay) =>
                    <div key={day.date+'-head'} className={styles.headerCell}>
                        {day.display}
                    </div>
                )}
            </div>
            {rooms.map((room:TypeRoom) =>
                <div className={styles.roomRow} key={room.num+'-col'}>
                    <div className={styles.roomCell}>№ {room.num}</div>
                    {daysList.map((day:TypeDay) =>
                        <div
                            key={room.num+'-'+day.date+'-cell'}
                            onClick={()=>clickDayRoom(day, room)}
                            className={isSelected(day, room, selected)}
                        >
                            <div className={styles.roomSubCell}></div>
                            <div className={styles.roomSubCellLeft}></div>
                            <div
                                onClick={() =>clickBooking(getBookingInfo(day, room, '_id'))}
                                className={styles.bookingCellFio}
                                style={{width: getWidthFio(day, room), overflow: 'hidden'}}
                            >
                                {getBookingInfo(day, room, 'fio')}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="clear"></div>
        </div>

        <div style={{textAlign: 'center', marginTop: '20px'}}>
            <Button onClick={PrevWeek} className={styles.controlButtons} title={'<< Prev'} />
            <Button onClick={NextWeek} className={styles.controlButtons} title={'Next >>'} />
        </div>
        <Button onClick={()=>{localStorage.clear(); document.location.reload();}} title={'Clear'} />
    </div>
}