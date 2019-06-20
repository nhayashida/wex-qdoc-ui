export enum ActionType {
  SET_SETTINGS = 'SET_SETTINGS',
  SHOW_ERROR_MESSAGE = 'SHOW_ERROR_MESSAGE',
  HIDE_ERROR_MESSAGE = 'HIDE_ERROR_MESSAGE',
}

export type Settings = {
  collectionId: string;
  bodyFieldId: string;
  titleFieldId: string;
  linkFieldId: string;
};

export type AppState = {
  settings: Settings;
  errorMessage: string;
};

type SetSettingsAction = {
  type: typeof ActionType.SET_SETTINGS;
  settings: Settings;
};

type ShowErrorMessageAction = {
  type: typeof ActionType.SHOW_ERROR_MESSAGE;
  errorMessage: string;
};

type HideErrorMessageAction = {
  type: typeof ActionType.HIDE_ERROR_MESSAGE;
};

export type AppActionTypes = SetSettingsAction & ShowErrorMessageAction & HideErrorMessageAction;
