import { ActionType, Collection, QueryResult } from './types';

export const setCollections = (collections: Collection[]) => ({
  collections,
  type: ActionType.SET_COLLECTIONS,
});

export const setQueryInput = (input: string) => ({
  input,
  type: ActionType.SET_QUERY_INPUT,
});

export const addQueryResult = (result: QueryResult) => ({
  result,
  type: ActionType.ADD_QUERY_RESULT,
});

export const clearQueryResult = () => ({
  type: ActionType.CLEAR_QUERY_RESULT,
});

export const startQuerying = () => ({
  type: ActionType.START_QUERYING,
});

export const endQuerying = () => ({
  type: ActionType.END_QUERYING,
});
