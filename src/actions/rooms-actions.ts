import { TypeRoom } from '../reducers/rooms-reducers';

import { ROOMS_FETCH_DATA_SUCCESS, ROOMS_IS_LOADING, ROOMS_HAS_ERRORED, CLEAR_ERRORS, DELETE_ROOMS, DELETE_ROOMS_SUCCESS, DELETE_ROOMS_ERRORS, UPDATE_ROOMS, UPDATE_ROOMS_SUCCESS, UPDATE_ROOMS_ERRORS, ADD_ROOMS, ADD_ROOMS_SUCCESS, ADD_ROOMS_ERRORS} from './types';

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
    return (dispatch: any) => {
        dispatch(roomsIsLoading(true));
        dispatch(roomsFetchDataSuccess([]));
        dispatch(roomsHasErrored(false));
        const rooms = [
            {
                _id: '1',
                num: 1,
                building: 2,
                capacity: 2,
                cost: '1000'
            },
            {
                _id: '2',
                num: 2,
                building: 2,
                capacity: 2,
                cost: '2000'
            },
            {
                _id: '3',
                num: 3,
                building: 2,
                capacity: 2,
                cost: '2000'
            }
        ]
        dispatch(roomsFetchDataSuccess(rooms));
        /*
        axios.get(url)
            .then((response) => {
                dispatch(roomsIsLoading(false));
                return response.data;
            })
            .then((rooms) => dispatch(roomsFetchDataSuccess(rooms)))
            .catch(function(err) {
                if(typeof err.response != 'undefined') {
                    if (err.response.data == 'Unauthorized')
                        unauth('itemsRoomsFetchData', url);
                    dispatch(roomsHasErrored(true))
                }
            });

         */
    };
}

export function clearErrors () {
    return {
        type: CLEAR_ERRORS,
        payload: {}
    }
}