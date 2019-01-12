import { Dispatch } from 'redux';
import actionTypes from './actionTypes';
import Explorer from '../services/explorer';
import Storage from '../services/storage';
import { Collection, QueryResult } from '../../../server/services/explorer';

const actions = {
  setQueryInput: (queryInput: string) => ({
    queryInput,
    type: actionTypes.SET_QUERY_INPUT,
  }),

  setQueryResult: (queryResult: QueryResult) => ({
    queryResult,
    type: actionTypes.SET_QUERY_RESULT,
  }),

  startQuery: () => ({
    type: actionTypes.START_QUERY,
  }),

  endQuery: () => ({
    type: actionTypes.END_QUERY,
  }),

  query: (input: string) => async (dispatch: Dispatch, getState) => {
    try {
      // Clear results
      dispatch(actions.setQueryResult({} as QueryResult));

      dispatch(actions.startQuery());
      const { collectionId, bodyField } = getState().settings;
      const res = await Explorer.query(collectionId, bodyField, input);
      dispatch(actions.endQuery());

      if (!res.docs || !res.docs.length) {
        throw new Error('No document found');
      }
      dispatch(actions.setQueryResult(res));
    } catch (err) {
      dispatch(actions.endQuery());
      dispatch(actions.showErrorMessage(err.message));
    }
  },

  setSettings: (settings: { [key: string]: string }) => ({
    settings,
    type: actionTypes.SET_SETTINGS,
  }),

  updateSetting: (key: string, value: string) => (dispatch: Dispatch) => {
    const settings = { [key]: value };
    Storage.set(settings);
    dispatch(actions.setSettings(settings));
  },

  setCollections: (collections: Collection[]) => ({
    collections,
    type: actionTypes.SET_COLLECTIONS,
  }),

  initialize: () => async (dispatch: Dispatch) => {
    try {
      const settings = Storage.load();
      dispatch(actions.setSettings(settings));

      const collections = await Explorer.listCollections();
      dispatch(actions.setCollections(collections));
    } catch (err) {
      dispatch(actions.showErrorMessage(err.message));
    }
  },

  showErrorMessage: (errorMessage: string) => ({
    errorMessage,
    type: actionTypes.SHOW_ERROR_MESSAGE,
  }),

  hideErrorMessage: () => ({
    type: actionTypes.HIDE_ERROR_MESSAGE,
  }),
};

export default actions;
