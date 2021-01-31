import {store} from '../src/configureStore';
import errorReducer from "../src/reducers/errors-reducers";
import "regenerator-runtime/runtime";

describe('Errors reducers', () => {
    test('Should dispatches correct errorReducer', () => {
        errorReducer({}, {type: 'GET_ERRORS'});
        expect(store.getState().errors).toEqual({});
    });
});
