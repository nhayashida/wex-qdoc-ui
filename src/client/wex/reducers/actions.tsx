import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import storage from '../services/storage';
import wex from '../services/wex';
import { setSettings, showErrorMessage } from './app/actions';
import { Settings } from './app/types';
import {
  addQueryResult,
  setCollections,
  setQueryInput,
  startQuerying,
  endQuerying,
} from './wex/actions';
import { State } from './store';

export const query = (q: string, page: number, count: number) => async (
  dispatch: ThunkDispatch<State, void, Action>,
  getState: () => State,
) => {
  try {
    dispatch(startQuerying());

    const { collectionId, bodyField } = getState().app.settings;
    const res = await wex.query({ collectionId, bodyField, q, page, count });

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

export const listCollections = () => async (dispatch: ThunkDispatch<State, void, Action>) => {
  try {
    const collections = await wex.listCollections();
    dispatch(setCollections(collections));
  } catch (err) {
    dispatch(showErrorMessage(err.message));
  }
};

export const updateSetting = (key: string, value: string) => (
  dispatch: ThunkDispatch<State, void, Action>,
) => {
  const settings = { [key]: value } as Settings;
  storage.set(settings);
  dispatch(setSettings(settings));
};

export const initialize = (q?: string) => async (dispatch: ThunkDispatch<State, void, Action>) => {
  try {
    const settings = (await storage.load()) as Settings;
    dispatch(setSettings(settings));

    // Execute query if ?q=<query> is set to url
    if (q) {
      dispatch(setQueryInput(q));
      dispatch(query(q, 0, 10));
    }
  } catch (err) {
    dispatch(showErrorMessage(err.message));
  }
};
