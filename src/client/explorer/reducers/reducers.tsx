import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import actionTypes from '../actions/actionTypes';
import { UserSettings } from '../services/storage';
import { Collection, QueryInput, QueryResult } from '../../../server/services/explorer';

const initialState = {
  collections: [] as Collection[],
  settings: {} as UserSettings,
  input: { text: '', page: 0, count: 10 } as QueryInput,
  result: { numFound: 0, docs: [] } as QueryResult,
  isQuerying: false,
  errorMessage: '',
};
Object.freeze(initialState);

const collections = (
  collections: Collection[] = initialState.collections,
  action: { type: number; collections: Collection[] },
) => {
  switch (action.type) {
    case actionTypes.SET_COLLECTIONS:
      return action.collections;
  }

  return collections;
};

const settings = (
  settings: UserSettings = initialState.settings,
  action: { type: number; settings: UserSettings },
) => {
  switch (action.type) {
    case actionTypes.SET_SETTINGS:
      return Object.assign({}, settings, action.settings);
  }

  return settings;
};

const input = (
  input: QueryInput = initialState.input,
  action: { type: number; input: QueryInput },
): QueryInput => {
  switch (action.type) {
    case actionTypes.SET_QUERY_INPUT:
      return action.input;
  }

  return input;
};

const result = (
  result: QueryResult = initialState.result,
  action: { type: number; result: QueryResult },
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

const isQuerying = (isQuerying: boolean = initialState.isQuerying, action: { type: number }) => {
  switch (action.type) {
    case actionTypes.START_QUERYING:
      return true;
    case actionTypes.STOP_QUERYING:
      return false;
  }

  return isQuerying;
};

const errorMessage = (
  errorMessage: string = initialState.errorMessage,
  action: { type: number; errorMessage: string },
): string => {
  switch (action.type) {
    case actionTypes.SHOW_ERROR_MESSAGE:
      return action.errorMessage;
    case actionTypes.HIDE_ERROR_MESSAGE:
      return '';
  }

  return errorMessage;
};

export const createStore = () => {
  const reducers = combineReducers({
    collections,
    settings,
    input,
    result,
    isQuerying,
    errorMessage,
  });
  return reduxCreateStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
};
