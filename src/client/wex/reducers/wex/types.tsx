export enum ActionType {
  SET_COLLECTIONS = 'SET_COLLECTIONS',
  SET_QUERY_INPUT = 'SET_QUERY_INPUT',
  ADD_QUERY_RESULT = 'ADD_QUERY_RESULT',
  CLEAR_QUERY_RESULT = 'CLEAR_QUERY_RESULT',
  START_QUERYING = 'START_QUERYING',
  END_QUERYING = 'END_QUERYING',
}

export type Collection = {
  id: string;
  name: string;
  bodyFieldId: string;
  fields: { id: string; label: string }[];
};

export type Document = {
  id: string;
  fields: { [key: string]: string };
  score?: number;
};

export type QueryResult = {
  numFound: number;
  docs: Document[];
};

export type WexState = {
  collections: Collection[];
  input: string;
  result: QueryResult;
  querying: boolean;
};

type SetCollectionsAction = {
  type: typeof ActionType.SET_COLLECTIONS;
  collections: Collection[];
};

type SetQueryInputAction = {
  type: typeof ActionType.SET_QUERY_INPUT;
  input: string;
};

type AddQueryResultAction = {
  type: typeof ActionType.ADD_QUERY_RESULT;
  result: QueryResult;
};

type ClearQueryResultAction = {
  type: typeof ActionType.CLEAR_QUERY_RESULT;
};

type StartQueryingAction = {
  type: typeof ActionType.START_QUERYING;
};

type EndQueryingAction = {
  type: typeof ActionType.END_QUERYING;
};

export type WexActionTypes = SetCollectionsAction &
  SetQueryInputAction &
  AddQueryResultAction &
  ClearQueryResultAction &
  StartQueryingAction &
  EndQueryingAction;
