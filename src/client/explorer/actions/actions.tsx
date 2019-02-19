import { Dispatch } from 'redux';
import actionTypes from './actionTypes';
import explorer from '../services/explorer';
import storage from '../services/storage';

const actions = {
  setInput: (input: Explorer.QueryInput) => ({
    input,
    type: actionTypes.SET_QUERY_INPUT,
  }),

  setInputText: (text: string) => async (dispatch: Dispatch, getState) => {
    const { input } = getState();
    dispatch(actions.setInput(Object.assign({}, input, { text })));
  },

  addResult: (result: Explorer.QueryResult) => ({
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
    type: actionTypes.END_QUERYING,
  }),

  query: (text: string, page: number, count: number) => async (dispatch: Dispatch, getState) => {
    try {
      dispatch(actions.startQuerying());

      const input = { text, page, count };
      dispatch(actions.setInput(input));

      const { collectionId, bodyField } = getState().settings;
      const res = await explorer.query(collectionId, bodyField, input);
      dispatch(actions.endQuerying());

      if (!res.docs || !res.docs.length) {
        throw new Error('No document found');
      }
      dispatch(actions.addResult(res));
    } catch (err) {
      dispatch(actions.showErrorMessage(err.message));
    } finally {
      dispatch(actions.endQuerying());
    }
  },

  setSettings: (settings: { [key: string]: string }) => ({
    settings,
    type: actionTypes.SET_SETTINGS,
  }),

  updateSetting: (key: string, value: string) => (dispatch: Dispatch) => {
    const settings = { [key]: value };
    storage.set(settings);
    dispatch(actions.setSettings(settings));
  },

  setCollections: (collections: Explorer.Collection[]) => ({
    collections,
    type: actionTypes.SET_COLLECTIONS,
  }),

  initialize: () => async (dispatch: Dispatch) => {
    try {
      const settings = storage.load();
      dispatch(actions.setSettings(settings));

      const collections = await explorer.listCollections();
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
