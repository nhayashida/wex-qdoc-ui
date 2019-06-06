import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import store from './reducers/store';

ReactDOM.render(
  // tslint:disable-next-line: jsx-wrap-multiline
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/wex" component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}
