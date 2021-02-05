import { ROOMS_FETCH_DATA_SUCCESS, ROOMS_IS_LOADING, ROOMS_HAS_ERRORED, DELETE_ROOMS_SUCCESS, UPDATE_ROOMS_SUCCESS, ADD_ROOMS_SUCCESS } from '../actions/types';

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
            return action.rooms

        case UPDATE_ROOMS_SUCCESS:
            if(payload[0] == null)
                payload[0] = 0
            var newArray = [...state]
            newArray[payload[0]] = {...newArray[payload[0]], ...payload[1]}
            return newArray

        case DELETE_ROOMS_SUCCESS:
            return [...state.slice(0, payload[0]), ...state.slice(payload[0] + 1)];

        case ADD_ROOMS_SUCCESS:
            return [...state, payload]

        default:
            return state;
    }
}