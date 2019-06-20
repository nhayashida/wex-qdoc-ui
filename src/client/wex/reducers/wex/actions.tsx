import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionType, Collection, QueryResult } from './types';
import { State } from '../store';
import { showErrorMessage } from '../app/actions';
import wex from '../../services/wex';

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

export const listCollections = () => async (dispatch: ThunkDispatch<State, void, Action>) => {
  try {
    const collections = await wex.listCollections();
    dispatch(setCollections(collections));
  } catch (err) {
    dispatch(showErrorMessage(err.message));
  }
};

export const query = (q: string, page: number, count: number) => async (
  dispatch: ThunkDispatch<State, void, Action>,
  getState: () => State,
) => {
  try {
    dispatch(startQuerying());

    const { collectionId, bodyFieldId } = getState().app.settings;
    const res = await wex.query({ collectionId, bodyFieldId, q, page, count });

    if (!res.docs || !res.docs.length) {
      throw new Error('No document found');
    }
    dispatch(addQueryResult(res));
  } catch (err) {
    dispatch(showErrorMessage(err.message));
  } finally {
    dispatch(endQuerying());
  }
};
