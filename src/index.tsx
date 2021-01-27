import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { history, store } from './configureStore'
import { App } from './App';

const target = document.querySelector('#root')

class Root extends Component {
    render() {
        return (
            <AppContainer>
                <Provider store={store}>
                    <App history={history} />
                </Provider>
            </AppContainer>
        )
    }
}

ReactDOM.render(<Root />, target);