import { combineReducers } from 'redux';
import { ExplorerActionTypes, ExplorerState, actionTypes } from './types';

const initState: ExplorerState = {
  collections: [] as Collection[],
  input: { text: '', page: 0, count: 10 } as QueryInput,
  result: { numFound: 0, docs: [] } as QueryResult,
  querying: false,
};

const collections = (state = initState.collections, action: ExplorerActionTypes) => {
  switch (action.type) {
    case actionTypes.SET_COLLECTIONS:
      return action.collections;
  }

  return state;
};

const input = (state = initState.input, action: ExplorerActionTypes) => {
  switch (action.type) {
    case actionTypes.SET_QUERY_INPUT:
      return action.input;
  }

  return state;
};

const result = (state = initState.result, action: ExplorerActionTypes) => {
  switch (action.type) {
    case actionTypes.ADD_QUERY_RESULT:
      action.result.docs = [...state.docs, ...action.result.docs];
      return action.result;
    case actionTypes.CLEAR_QUERY_RESULT:
      return initState.result;
  }

  return state;
};

const querying = (state = initState.querying, action: ExplorerActionTypes) => {
  switch (action.type) {
    case actionTypes.START_QUERYING:
      return true;
    case actionTypes.END_QUERYING:
      return false;
  }

  return state;
};

export const explorerReducer = combineReducers({
  collections,
  input,
  result,
  querying,
});
