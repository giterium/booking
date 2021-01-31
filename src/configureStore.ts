import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from './reducers'

export const history = createBrowserHistory()
const initialState = {}
export default function configureStore() {
    // @ts-ignore
    const composeEnhancer:any =  (window && (window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    const store = createStore(

        createRootReducer(history),

        initialState,

        composeEnhancer(
            applyMiddleware(
                thunk
            ),
        ),
    )
    return store
}

export const store = configureStore();