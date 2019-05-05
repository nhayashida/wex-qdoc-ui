export enum actionTypes {
  SET_COLLECTIONS = 'SET_COLLECTIONS',
  SET_QUERY_INPUT = 'SET_QUERY_INPUT',
  ADD_QUERY_RESULT = 'ADD_QUERY_RESULT',
  CLEAR_QUERY_RESULT = 'CLEAR_QUERY_RESULT',
  START_QUERYING = 'START_QUERYING',
  END_QUERYING = 'END_QUERYING',
}

export type ExplorerState = {
  collections: Collection[];
  input: QueryInput;
  result: QueryResult;
  querying: boolean;
};

type SetCollectionsAction = {
  type: typeof actionTypes.SET_COLLECTIONS;
  collections: Collection[];
};

type SetQueryInputAction = {
  type: typeof actionTypes.SET_QUERY_INPUT;
  input: QueryInput;
};

type AddQueryResultAction = {
  type: typeof actionTypes.ADD_QUERY_RESULT;
  result: QueryResult;
};

type ClearQueryResultAction = {
  type: typeof actionTypes.CLEAR_QUERY_RESULT;
};

type StartQueryingAction = {
  type: typeof actionTypes.START_QUERYING;
};

type EndQueryingAction = {
  type: typeof actionTypes.END_QUERYING;
};

export type ExplorerActionTypes = SetCollectionsAction &
  SetQueryInputAction &
  AddQueryResultAction &
  ClearQueryResultAction &
  StartQueryingAction &
  EndQueryingAction;
