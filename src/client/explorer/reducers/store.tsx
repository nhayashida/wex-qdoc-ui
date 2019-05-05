import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { appReducer } from './app/reducers';
import { explorerReducer } from './explorer/reducers';

const rootReducer = combineReducers({
  app: appReducer,
  explorer: explorerReducer,
});

export type State = ReturnType<typeof rootReducer>;

export const store = reduxCreateStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
