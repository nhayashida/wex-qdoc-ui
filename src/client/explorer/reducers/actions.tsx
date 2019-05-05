import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import explorer from '../services/explorer';
import storage from '../services/storage';
import { setSettings, showErrorMessage } from './app/actions';
import { Settings } from './app/types';
import {
  addQueryResult,
  setCollections,
  setQueryInput,
  startQuerying,
  endQuerying,
} from './explorer/actions';
import { State } from './store';

const actions = {
  setInputText: (text: string) => async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => State,
  ) => {
    const { input } = getState().explorer;
    dispatch(setQueryInput(Object.assign({}, input, { text })));
  },

  query: (text: string, page: number, count: number) => async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => State,
  ) => {
    try {
      dispatch(startQuerying());

      const input = { text, page, count };
      dispatch(setQueryInput(input));

      const { collectionId, bodyField } = getState().app.settings;
      const res = await explorer.query(collectionId, bodyField, input);

      if (!res.docs || !res.docs.length) {
        throw new Error('No document found');
      }
      dispatch(addQueryResult(res));
    } catch (err) {
      dispatch(showErrorMessage(err.message));
    } finally {
      dispatch(endQuerying());
    }
  },

  updateSetting: (key: string, value: string) => (dispatch: ThunkDispatch<State, void, Action>) => {
    const settings = { [key]: value } as Settings;
    storage.set(settings);
    dispatch(setSettings(settings));
  },

  initCollections: () => async (dispatch: ThunkDispatch<State, void, Action>) => {
    const collections = await explorer.listCollections();
    dispatch(setCollections(collections));
  },

  initialize: (q?: string) => async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => State,
  ) => {
    try {
      const settings = (await storage.load()) as Settings;
      dispatch(setSettings(settings));

      // Execute query if ?q=<query> is set to url
      if (q) {
        const { input } = getState().explorer;
        const { count } = input;
        dispatch(actions.query(q, 0, count));
      }
    } catch (err) {
      dispatch(showErrorMessage(err.message));
    }
  },
};

export default actions;
