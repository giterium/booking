import { TypeRoom } from '../reducers/rooms-reducers';
import { rooms } from './rooms-data';

import { ROOMS_FETCH_DATA_SUCCESS, ROOMS_IS_LOADING, ROOMS_HAS_ERRORED} from './types';

export function roomsHasErrored(bool: boolean) {
    return {
        type: ROOMS_HAS_ERRORED,
        hasErrored: bool
    };
}

export function roomsIsLoading(bool: boolean) {
    return {
        type: ROOMS_IS_LOADING,
        isLoading: bool
    };
}

export function roomsFetchDataSuccess(rooms: TypeRoom[]) {
    return {
        type: ROOMS_FETCH_DATA_SUCCESS,
        rooms
    };
}

export function itemsRoomsFetchData(url: string) {
    return (dispatch) => {
        dispatch(roomsIsLoading(true));
        dispatch(roomsHasErrored(false));
        dispatch(roomsFetchDataSuccess(rooms));
    };
}