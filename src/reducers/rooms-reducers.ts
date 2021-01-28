import { Action } from 'redux'
import { ROOMS_FETCH_DATA_SUCCESS, ROOMS_IS_LOADING, ROOMS_HAS_ERRORED, CLEAR_ERRORS, DELETE_ROOMS, DELETE_ROOMS_SUCCESS, UPDATE_ROOMS, UPDATE_ROOMS_SUCCESS, UPDATE_ROOMS_ERRORS, ADD_ROOMS, ADD_ROOMS_SUCCESS, ADD_ROOMS_ERRORS } from '../actions/types';
import {RootState} from "./index";

export interface TypeRoom {
    _id: string;
    num: number;
    building: number;
    capacity: number;
    cost: string;
}

export function roomsHasErrored(state = false, action: {type: string; hasErrored: boolean}) {
    switch (action.type) {
        case ROOMS_HAS_ERRORED:
            return action.hasErrored;

        default:
            return state;
    }
}

export function roomsIsLoading(state = false, action: {type: string; isLoading: boolean}) {
    switch (action.type) {
        case ROOMS_IS_LOADING:
            return action.isLoading;

        default:
            return state;
    }
}

export function rooms(state:TypeRoom[] = [], action:{type: string; rooms: TypeRoom[]; payload: TypeRoom;}) {
    const payload = action.payload
    switch (action.type) {
        case ROOMS_FETCH_DATA_SUCCESS:
            var newState:any = action.rooms;
            return [].concat(newState);

        case UPDATE_ROOMS_SUCCESS:
            if(payload[0] == null) payload[0] = 0;
            var newState:any = state;
            newState[payload[0]] = payload[1];
            state = [];
            return state.concat(newState);

        case DELETE_ROOMS_SUCCESS:
            var newState:any = state;
            newState.splice(payload[0], 1);
            state = [];
            return state.concat(newState);

        case ADD_ROOMS_SUCCESS:
            return state.concat(payload);

        default:
            return state;
    }
}