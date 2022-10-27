import { ActionReducerMap } from '@ngrx/store';
import { AppState, AuthState } from './../../shared/shared.model';
import * as AuthAction from './auth.action';

const initialState: AuthState = {
  user: null,
  authError: null,
  authSuccess: null,
  loading: false,
};

export function authReducer(
  state = initialState,
  action: AuthAction.AuthActions
) {
  switch (action.type) {
    case AuthAction.SIGNUP_START:
    case AuthAction.LOGIN_START:
      return {
        ...state,
        authError: null,
        authSuccess: null,
        loading: true,
      };

    case AuthAction.WEBAUTH_REG:
    case AuthAction.WEBAUTH_REG_VERIFICATION:
    case AuthAction.WEBAUTH_LOGIN:
    case AuthAction.WEBAUTH_LOGIN_VERIFICATION:
      return {
        ...state,
        authError: null,
        authSuccess: null,
        loading: true,
      };

    case AuthAction.SIGNUP_SUCCESS:
      const { message } = action.payload;
      return {
        ...state,
        authError: null,
        authSuccess: message,
        loading: false,
      };

    case AuthAction.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        authSuccess: 'login Successful',
        authError: null,
        loading: false,
      };

    case AuthAction.AUTHETICATE_FAIL:
      return {
        ...state,
        authError: action.payload,
        authSuccess: null,
        loading: false,
      };

    case AuthAction.HANDLE_ERROR:
      return {
        ...state,
        authError: null,
        authSuccess: null,
      };

    case AuthAction.LOGOUT:
      return {
        user: null,
        authError: null,
        authSuccess: null,
        loading: false,
      };

    default:
      return state;
  }
}

export const Store: ActionReducerMap<AppState> = {
  auth: authReducer,
};
