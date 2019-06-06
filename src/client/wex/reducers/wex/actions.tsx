import { actionTypes } from './types';

export const setCollections = (collections: Collection[]) => ({
  collections,
  type: actionTypes.SET_COLLECTIONS,
});

export const setQueryInput = (input: QueryInput) => ({
  input,
  type: actionTypes.SET_QUERY_INPUT,
});

export const addQueryResult = (result: QueryResult) => ({
  result,
  type: actionTypes.ADD_QUERY_RESULT,
});

export const clearQueryResult = () => ({
  type: actionTypes.CLEAR_QUERY_RESULT,
});

export const startQuerying = () => ({
  type: actionTypes.START_QUERYING,
});

export const endQuerying = () => ({
  type: actionTypes.END_QUERYING,
});
