import { Settings, actionTypes } from './types';

export const setSettings = (settings: Settings) => ({
  settings,
  type: actionTypes.SET_SETTINGS,
});

export const showErrorMessage = (errorMessage: string) => ({
  errorMessage,
  type: actionTypes.SHOW_ERROR_MESSAGE,
});

export const hideErrorMessage = () => ({
  type: actionTypes.HIDE_ERROR_MESSAGE,
});
