import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { createStore } from './reducers/reducers';

ReactDOM.render(
  <Provider store={createStore()}>
    <BrowserRouter>
      <Route path="/explorer" component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);
