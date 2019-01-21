import { Dispatch } from 'redux';
import actionTypes from './actionTypes';
import Explorer from '../services/explorer';
import Storage from '../services/storage';
import { Collection, QueryInput, QueryResult } from '../../../server/services/explorer';

const actions = {
  setInput: (input: QueryInput) => ({
    input,
    type: actionTypes.SET_QUERY_INPUT,
  }),

  setInputText: (text: string) => async (dispatch: Dispatch, getState) => {
    const { input } = getState();
    dispatch(actions.setInput(Object.assign({}, input, { text })));
  },

  addResult: (result: QueryResult) => ({
    result,
    type: actionTypes.ADD_QUERY_RESULT,
  }),

  clearResult: () => ({
    type: actionTypes.CLEAR_QUERY_RESULT,
  }),

  startQuerying: () => ({
    type: actionTypes.START_QUERYING,
  }),

  endQuerying: () => ({
    type: actionTypes.STOP_QUERYING,
  }),

  query: (text: string, page: number, count: number) => async (dispatch: Dispatch, getState) => {
    try {
      const input = { text, page, count };
      dispatch(actions.setInput(input));

      dispatch(actions.startQuerying());
      const { collectionId, bodyField } = getState().settings;
      const res = await Explorer.query(collectionId, bodyField, input);
      dispatch(actions.endQuerying());

      if (!res.docs || !res.docs.length) {
        throw new Error('No document found');
      }
      dispatch(actions.addResult(res));
    } catch (err) {
      dispatch(actions.endQuerying());
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
