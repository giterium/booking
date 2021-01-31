import {store} from '../src/configureStore';
import * as selectActions from "../src/actions/rooms-actions";
import "regenerator-runtime/runtime";

describe('Rooms actions', () => {
    test('Should dispatches correct itemsRoomsFetchData', () => {
        store.dispatch(selectActions.itemsRoomsFetchData(''));
        expect(store.getState().rooms.length).toEqual(5);
    });
});
