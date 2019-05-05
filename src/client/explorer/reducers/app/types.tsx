export enum actionTypes {
  SET_SETTINGS = 'SET_SETTINGS',
  SHOW_ERROR_MESSAGE = 'SHOW_ERROR_MESSAGE',
  HIDE_ERROR_MESSAGE = 'HIDE_ERROR_MESSAGE',
}

export type Settings = {
  collectionId: string;
  bodyField: string;
  titleField: string;
  linkField: string;
};

export type AppState = {
  settings: Settings;
  errorMessage: string;
};

type SetSettingsAction = {
  type: typeof actionTypes.SET_SETTINGS;
  settings: Settings;
};

type ShowErrorMessageAction = {
  type: typeof actionTypes.SHOW_ERROR_MESSAGE;
  errorMessage: string;
};

type HideErrorMessageAction = {
  type: typeof actionTypes.HIDE_ERROR_MESSAGE;
};

export type AppActionTypes = SetSettingsAction & ShowErrorMessageAction & HideErrorMessageAction;
