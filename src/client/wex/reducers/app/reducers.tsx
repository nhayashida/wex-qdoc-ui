import { combineReducers } from 'redux';
import { AppState, AppActionTypes, Settings, ActionType } from './types';

const initState: AppState = {
  settings: {} as Settings,
  errorMessage: '',
};

const settings = (state = initState.settings, action: AppActionTypes) => {
  switch (action.type) {
    case ActionType.SET_SETTINGS:
      return {
        ...state,
        ...action.settings,
      };
  }

  return state;
};

const errorMessage = (state = initState.errorMessage, action: AppActionTypes) => {
  switch (action.type) {
    case ActionType.SHOW_ERROR_MESSAGE:
      return action.errorMessage;
    case ActionType.HIDE_ERROR_MESSAGE:
      return initState.errorMessage;
  }

  return state;
};

export const appReducer = combineReducers({
  settings,
  errorMessage,
});
