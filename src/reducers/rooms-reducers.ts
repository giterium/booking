import { ROOMS_FETCH_DATA_SUCCESS, ROOMS_IS_LOADING, ROOMS_HAS_ERRORED, CLEAR_ERRORS, DELETE_ROOMS, DELETE_ROOMS_SUCCESS, UPDATE_ROOMS, UPDATE_ROOMS_SUCCESS, UPDATE_ROOMS_ERRORS, ADD_ROOMS, ADD_ROOMS_SUCCESS, ADD_ROOMS_ERRORS } from '../actions/types';

export interface TypeRoom {
    _id: string;
    num: number;
    building: number;
    capacity: number;
    cost: string;
}

export function roomsHasErrored(state = false, action: any) {
    switch (action.type) {
        case ROOMS_HAS_ERRORED:
            return action.hasErrored;

        default:
            return state;
    }
}

export function roomsIsLoading(state = false, action: any) {
    switch (action.type) {
        case ROOMS_IS_LOADING:
            return action.isLoading;

        default:
            return state;
    }
}

export function rooms(state:TypeRoom[] = [], action: any) {
    const payload = action.payload
    switch (action.type) {
        case ROOMS_FETCH_DATA_SUCCESS:
            var newArr:any = action.rooms
            return [].concat(newArr);

        case UPDATE_ROOMS_SUCCESS:
            if(payload[0] == null) payload[0] = 0;
            var newArr:any = state;
            newArr[payload[0]] = payload[1];
            state = [];
            return state.concat(newArr);

        case DELETE_ROOMS_SUCCESS:
            var newArr:any = state;
            newArr.splice(payload[0], 1);
            state = [];
            return state.concat(newArr);

        case ADD_ROOMS_SUCCESS:
            var newArr:any = state.concat(payload);
            state = [];
            state.concat(newArr);
            return state.concat(newArr);

        default:
            return state;
    }
}