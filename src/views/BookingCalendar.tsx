import React, {useEffect, useState}  from 'react';
import {TypeRoom} from "../reducers/rooms-reducers";
import moment, {Moment} from 'moment';
import styles from '../css/booking.module.css';
import {Button} from "../components/Button";
import {TypeBooking} from "../reducers/booking-reducers";
import {isGoodRange, timenull, isBooking, isSelected} from "../helpers/booking-helpers";

export interface TypeDay {
    date: Date;
    display: Date;
}

interface TypeItemSelected {
    day: null | Moment;
    room: string | boolean;
}

interface TypeSelected {
    start: TypeItemSelected;
    end: TypeItemSelected;
}

type CalendarProps = {
    onChangeSelected: (selected: TypeSelected) => void;
    onClickBooking: (id: string) => void;
    selected?: TypeSelected;
    rooms: TypeRoom[];
    booking: TypeBooking[];
    startDate: Date | Moment;
    endDate: Date | Moment;
};

export const Calendar = (props : CalendarProps) => {
    const [startDate, setStartDate] = useState(props.startDate);
    const [endDate, setEndDate] = useState(props.endDate);
    const [daysList, setDaysList] = useState([]);
    const [selected, setSelected] = useState({
        start:{day:null, room:false},
        end:{day:null, room:false}
    });

    const unSelected = () => {
        setSelected({
            start:{day:false, room:false},
            end:{day:false, room:false}
        });
    }

    const getBookingInfo = (day, room, field) => {
        for(const curBooking of props.booking) {
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
        for(const curBooking of props.booking) {
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

    const clickDayRoom = (day, room) => {
        if(isBooking(day, room) != styles.isBooking && isBooking(day, room) != styles.isBooking + ' '+styles.isFirstBooking+ ' '+styles.isLastBooking) {
            if (!selected.start.day) {
                setSelected({
                    start: {day: day.date, room: room._id},
                    end: {day: false, room: false}
                })
            } else {
                if (!selected.end.day) {
                    if(isGoodRange(selected.start.day, day.date, room._id)) {
                        if (selected.start.day.format('DD.MM.YY') == day.date.format('DD.MM.YY')) {
                            unSelected();
                        } else if (selected.start.room != room._id)
                            unSelected();
                        else {
                            if (day.date < selected.start.day) {
                                setSelected({
                                    start: {day: day.date, room: room._id},
                                    end: selected.start
                                })
                            } else {
                                setSelected({
                                    start: selected.start,
                                    end: {day: day.date, room: room._id}
                                })
                            }
                        }
                    }
                    else {
                        unSelected();
                    }
                }
                else {
                    unSelected();
                }
            }
        }
        else {
            unSelected();
        }
    };

    const NextWeek = () => {
        setStartDate(startDate.clone().add(7, 'days'));
        setEndDate(endDate.clone().add(7, 'days'));
    };

    const PrevWeek = () => {
        setStartDate(startDate.clone().subtract(7, 'days'));
        setEndDate(endDate.clone().subtract(7, 'days'));
    };

    const clickBooking = (id) => {
        if(!selected.start.day) {
            props.onClickBooking(id);
        }
    }

    useEffect(() => {
        if(selected.end.day)
            props.onChangeSelected(selected);
    }, [selected]);

    useEffect(() => {
        setSelected(props.selected);
    }, [props.selected]);

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
            {props.rooms.map((room:TypeRoom) =>
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