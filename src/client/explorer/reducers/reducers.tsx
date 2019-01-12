import { applyMiddleware, combineReducers, createStore as reduxCreateStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import actionTypes from '../actions/actionTypes';
import { Collection, QueryResult } from '../../../server/services/explorer';

export type UserSettings = {
  collectionId: string;
  bodyField: string;
  titleField: string;
  linkField: string;
};

const initialState = {
  settings: {} as UserSettings,
  collections: [] as Collection[],
  queryInput: '',
  queryResult: {} as QueryResult,
  querying: false,
  errorMessage: '',
};
Object.freeze(initialState);

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

const queryInput = (
  queryInput: string = initialState.queryInput,
  action: { type: number; queryInput: string },
): string => {
  switch (action.type) {
    case actionTypes.SET_QUERY_INPUT:
      return action.queryInput;
  }

  return queryInput;
};

const queryResult = (
  queryResult: QueryResult = initialState.queryResult,
  action: { type: number; queryResult: QueryResult },
) => {
  switch (action.type) {
    case actionTypes.SET_QUERY_RESULT:
      return action.queryResult;
  }

  return queryResult;
};

const querying = (querying: boolean = initialState.querying, action: { type: number }) => {
  switch (action.type) {
    case actionTypes.START_QUERY:
      return true;
    case actionTypes.END_QUERY:
      return false;
  }

  return querying;
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
    settings,
    collections,
    queryInput,
    queryResult,
    querying,
    errorMessage,
  });
  return reduxCreateStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
};
