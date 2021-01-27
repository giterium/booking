import React, {useEffect} from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import {TypeRoom} from "../reducers/rooms-reducers";
import {itemsRoomsFetchData} from '../actions/rooms-actions';

const Booking = () => {
    const rooms:TypeRoom[] = useSelector((state: any) => state.rooms , shallowEqual);
    const dispatch: any = useDispatch();
    useEffect(() => {
        if(rooms.length == 0)
            dispatch(itemsRoomsFetchData('/api/rooms/getall'))
        //if(booking.length == 0)
        //    dispatch(itemsBookingFetchData('/api/booking/getall'))
    }, []);

    return (
        <h3>{rooms.length}</h3>
    );
};

export default Booking;