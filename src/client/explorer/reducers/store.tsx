import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import actionTypes from '../actions/actionTypes';

const initialState = {
  collections: [] as Explorer.Collection[],
  settings: {} as UserSettings,
  input: { text: '', page: 0, count: 10 } as Explorer.QueryInput,
  result: { numFound: 0, docs: [] } as Explorer.QueryResult,
  querying: false,
  errorMessage: '',
};
Object.freeze(initialState);

const collections = (
  collections: Explorer.Collection[] = initialState.collections,
  action: { type: string; collections: Explorer.Collection[] },
) => {
  switch (action.type) {
    case actionTypes.SET_COLLECTIONS:
      return action.collections;
  }

  return collections;
};

const settings = (
  settings: UserSettings = initialState.settings,
  action: { type: string; settings: UserSettings },
) => {
  switch (action.type) {
    case actionTypes.SET_SETTINGS:
      return Object.assign({}, settings, action.settings);
  }

  return settings;
};

const input = (
  input: Explorer.QueryInput = initialState.input,
  action: { type: string; input: Explorer.QueryInput },
): Explorer.QueryInput => {
  switch (action.type) {
    case actionTypes.SET_QUERY_INPUT:
      return action.input;
  }

  return input;
};

const result = (
  result: Explorer.QueryResult = initialState.result,
  action: { type: string; result: Explorer.QueryResult },
) => {
  switch (action.type) {
    case actionTypes.ADD_QUERY_RESULT:
      action.result.docs = [...result.docs, ...action.result.docs];
      return action.result;
    case actionTypes.CLEAR_QUERY_RESULT:
      return initialState.result;
  }

  return result;
};

const querying = (querying: boolean = initialState.querying, action: { type: string }) => {
  switch (action.type) {
    case actionTypes.START_QUERYING:
      return true;
    case actionTypes.END_QUERYING:
      return false;
  }

  return querying;
};

const errorMessage = (
  errorMessage: string = initialState.errorMessage,
  action: { type: string; errorMessage: string },
): string => {
  switch (action.type) {
    case actionTypes.SHOW_ERROR_MESSAGE:
      return action.errorMessage;
    case actionTypes.HIDE_ERROR_MESSAGE:
      return '';
  }

  return errorMessage;
};

const rootReducer = combineReducers({
  collections,
  settings,
  input,
  result,
  querying,
  errorMessage,
});

export const store = reduxCreateStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
