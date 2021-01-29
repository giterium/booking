import React, {useEffect, useState, useContext}  from 'react';
import {TypeRoom} from "../reducers/rooms-reducers";
import {shallowEqual, useSelector} from "react-redux";
import moment, {Moment} from 'moment';
import {WindowContext, IContextProps} from './Booking';
import styles from '../css/booking.module.css';
import {TypeBooking} from "../reducers/booking-reducers";
import {RootState} from "../reducers";
import {isGoodDiapazon, timenull, isBooking, isSelected} from "../helpers/booking-helpers";

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
};

export const Calendar = (props : CalendarProps) => {
    //const rooms: TypeRoom[] = useSelector((state: RootState) => state.rooms, shallowEqual);
    //const booking: TypeBooking[] = useSelector((state: RootState) => state.booking, shallowEqual);
    const [startDate, setStartDate] = useState<Moment>(moment().milliseconds(0).second(0).minutes(0).hours(0));
    const [endDate, setEndDate] = useState<Moment>(moment().add(13,'days').milliseconds(0).second(0).minutes(0).hours(0));
    const [daysList, setDaysList] = useState<TypeDay[]>([]);
    const [selected, setSelected] = useState<TypeSelected>({
        start:{day:null, room:false},
        end:{day:null, room:false}
    });

    const { openWindow } = useContext<IContextProps>(WindowContext);


    const unSelected = () => {
        setSelected({
            start:{day:false, room:false},
            end:{day:false, room:false}
        });
    }

    const getBookingId = (day, room) => {
        for(const curBooking of props.booking) {
            if (
                curBooking.room == room._id
                &&
                moment(timenull(curBooking.startDate)).diff(timenull(day.date)) == 0
            ) {
                return curBooking._id;
            }
        }
        return 0;
    }

    const getBookingFio = (day, room) => {
        for(const curBooking of props.booking) {
            if (
                curBooking.room == room._id
                &&
                moment(timenull(curBooking.startDate)).diff(timenull(day.date)) == 0
            ) {
                return curBooking.fio;
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
                    if(isGoodDiapazon(selected.start.day, day.date, room._id)) {
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

                            /*
                            setOpenWindow(true);
                            setCurrentBooking({
                                _id: 'create',
                                cost: Math.abs(day.date.diff(selected.start.day, "days") * room.cost),
                                fio: '',
                                room: room._id,
                                startDate: selected.start.day.format('YYYY-MM-DD'),
                                endDate: moment(day.date).format('YYYY-MM-DD')
                            });

                             */
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

    const editBooking = (id) => {

        //const editBooking = props.booking.filter(item => item._id == id)[0];
        props.onClickBooking(id);
        //setCurrentBooking(editBooking);
        //setOpenWindow(true);
    }

    const NextWeek = () => {
        setStartDate(startDate.clone().add(7, 'days'));
        setEndDate(endDate.clone().add(7, 'days'));
    };

    const PrevWeek = () => {
        setStartDate(startDate.clone().subtract(7, 'days'));
        setEndDate(endDate.clone().subtract(7, 'days'));
    };

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

    return <div >

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
                                onClick={() =>editBooking(getBookingId(day, room))}
                                className={styles.bookingCellFio}
                                style={{width: getWidthFio(day, room), overflow: 'hidden'}}
                            >
                                {getBookingFio(day, room)}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="clear"></div>
        </div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
            <button onClick={PrevWeek} className={styles.controlButtons}>{'<< Prev'}</button>
            <button onClick={NextWeek} className={styles.controlButtons}>{'Next >>'}</button>
        </div>
        <button onClick={()=>{localStorage.clear(); document.location.reload();}}>{'Clear'}</button>
    </div>
}