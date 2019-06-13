import { combineReducers } from 'redux';
import { ActionType, Collection, QueryResult, WexActionTypes, WexState } from './types';

const initState: WexState = {
  collections: [] as Collection[],
  input: '',
  result: { numFound: 0, docs: [] } as QueryResult,
  querying: false,
};

const collections = (state = initState.collections, action: WexActionTypes) => {
  switch (action.type) {
    case ActionType.SET_COLLECTIONS:
      return action.collections;
  }

  return state;
};

const input = (state = initState.input, action: WexActionTypes) => {
  switch (action.type) {
    case ActionType.SET_QUERY_INPUT:
      return action.input;
  }

  return state;
};

const result = (state = initState.result, action: WexActionTypes) => {
  switch (action.type) {
    case ActionType.ADD_QUERY_RESULT:
      action.result.docs = [...state.docs, ...action.result.docs];
      return action.result;
    case ActionType.CLEAR_QUERY_RESULT:
      return initState.result;
  }

  return state;
};

const querying = (state = initState.querying, action: WexActionTypes) => {
  switch (action.type) {
    case ActionType.START_QUERYING:
      return true;
    case ActionType.END_QUERYING:
      return false;
  }

  return state;
};

export const wexReducer = combineReducers({
  collections,
  input,
  result,
  querying,
});
