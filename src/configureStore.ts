import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from './reducers'

export const history = createBrowserHistory()

export default function configureStore(preloadedState) {
    const composeEnhancer =  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    const store = createStore(
        createRootReducer(history),
        preloadedState,
        composeEnhancer(
            applyMiddleware(
                thunk
            ),
        ),
    )
    return store
}

export const store = configureStore([]);