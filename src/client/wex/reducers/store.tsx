import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { appReducer } from './app/reducers';
import { wexReducer } from './wex/reducers';

const rootReducer = combineReducers({
  app: appReducer,
  wex: wexReducer,
});
export type State = ReturnType<typeof rootReducer>;

const store = reduxCreateStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export default store;
