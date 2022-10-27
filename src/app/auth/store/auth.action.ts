import { Action } from '@ngrx/store';
import {
  PubCredential,
  PubRequestCredential,
  User,
} from 'src/app/shared/shared.model';

export const LOGIN_START = '[Auth] Login Start';
export const AUTHETICATE_FAIL = '[Auth] Authenticate Fail';
export const SIGNUP_START = '[Auth] Signup Start';
export const WEBAUTH_REG = '[Auth] Webaauthn Registration';
export const WEBAUTH_REG_VERIFICATION =
  '[Auth] Webaauthn Registration Verification';
export const WEBAUTH_LOGIN = '[Auth] Webaauthn Login';
export const WEBAUTH_LOGIN_VERIFICATION = '[Auth] Webaauthn Login Verification';
export const SIGNUP_SUCCESS = '[Auth] Signup Success';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const HANDLE_ERROR = ' [Auth] Handle Error';
export const AUTO_LOGIN = ' [Auth] Auto Login';
export const AUTO_LOGOUT = ' [Auth] Auto Logout';
export const LOGOUT = '[Auth] Logout';

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: string) {}
}

export class WebAuthReg implements Action {
  readonly type = WEBAUTH_REG;

  constructor(public payload: PublicKeyCredentialCreationOptions) {}
}

export class WebAuthRegVerifiation implements Action {
  readonly type = WEBAUTH_REG_VERIFICATION;

  constructor(public payload: PubCredential) {}
}

export class SignupSuccess implements Action {
  readonly type = SIGNUP_SUCCESS;

  constructor(public payload: { message: string }) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(
    public payload: { user: User; message: string; expiration: number }
  ) {}
}

export class AuthenticateFailure implements Action {
  readonly type = AUTHETICATE_FAIL;

  constructor(public payload: string) {}
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: string) {}
}

export class WebaauthnLogin implements Action {
  readonly type = WEBAUTH_LOGIN;

  constructor(public payload: PublicKeyCredentialRequestOptions) {}
}

export class WebaauthnLoginVerification implements Action {
  readonly type = WEBAUTH_LOGIN_VERIFICATION;

  constructor(public payload: PubRequestCredential) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class AutoLogout implements Action {
  readonly type = AUTO_LOGOUT;

  constructor(public payload: number) {}
}

export class HandleError implements Action {
  readonly type = HANDLE_ERROR;
}

export type AuthActions =
  | SignupStart
  | WebAuthReg
  | WebAuthRegVerifiation
  | SignupSuccess
  | AuthenticateFailure
  | LoginStart
  | WebaauthnLogin
  | WebaauthnLoginVerification
  | LoginSuccess
  | Logout
  | AutoLogin
  | AutoLogout
  | HandleError;
