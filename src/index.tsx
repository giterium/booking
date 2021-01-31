import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { store } from './configureStore';
import { App } from './App';

const target = document.querySelector('#root')

class Root extends Component {
    render() {
        return (
            <AppContainer>
                <Provider store={store}>
                    <App />
                </Provider>
            </AppContainer>
        )
    }
}

ReactDOM.render(<Root />, target);

if (module.hot) {
    // Reload components
    module.hot.accept('./App', () => {
        ReactDOM.render(<Root />, target)
    })
}
