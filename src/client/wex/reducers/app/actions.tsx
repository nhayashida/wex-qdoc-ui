import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionType, Settings } from './types';
import { State } from '../store';
import { setQueryInput, query } from '../wex/actions';
import storage from '../../services/storage';

export const setSettings = (settings: Settings) => ({
  settings,
  type: ActionType.SET_SETTINGS,
});

export const showErrorMessage = (errorMessage: string) => ({
  errorMessage,
  type: ActionType.SHOW_ERROR_MESSAGE,
});

export const hideErrorMessage = () => ({
  type: ActionType.HIDE_ERROR_MESSAGE,
});

export const updateSettings = (props: { [key: string]: string }) => (
  dispatch: ThunkDispatch<State, void, Action>,
) => {
  storage.set(props);
  dispatch(setSettings(props as Settings));
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
