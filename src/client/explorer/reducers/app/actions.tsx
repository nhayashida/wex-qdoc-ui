import { Settings, ActionType } from './types';

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
