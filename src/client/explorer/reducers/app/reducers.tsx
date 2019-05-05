import { combineReducers } from 'redux';
import { AppState, AppActionTypes, Settings, actionTypes } from './types';

const initState: AppState = {
  settings: {} as Settings,
  errorMessage: '',
};

const settings = (state = initState.settings, action: AppActionTypes) => {
  switch (action.type) {
    case actionTypes.SET_SETTINGS:
      return {
        ...state,
        ...action.settings,
      };
  }

  return state;
};

const errorMessage = (state = initState.errorMessage, action: AppActionTypes) => {
  switch (action.type) {
    case actionTypes.SHOW_ERROR_MESSAGE:
      return action.errorMessage;
    case actionTypes.HIDE_ERROR_MESSAGE:
      return initState.errorMessage;
  }

  return state;
};

export const appReducer = combineReducers({
  settings,
  errorMessage,
});
