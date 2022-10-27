import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, of, switchMap, tap } from 'rxjs';
import {
  AuthResponseData,
  base64URLStringToBuffer,
  bufferToBase64URLString,
  PubCredential,
  PubRequestCredential,
  User,
} from 'src/app/shared/shared.model';
import { environment } from 'src/environments/environment';
import * as AuthAction from './auth.action';

const handleAuthentication = (
  userId: string,
  name: string,
  token: string,
  expiresIn: number,
  message: string
) => {
  const expirationDate = new Date(Date.now() + expiresIn * 1000);
  const user = new User(userId, name, token, expirationDate);

  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthAction.LoginSuccess({
    user,
    message,
    expiration: expiresIn * 1000,
  });
};

const handleError = (errorRes: HttpErrorResponse) => {
  let errorMsg: string = 'An unknown error occrurred';
  const message = errorRes.error?.message;

  console.log(errorRes.error);

  if (!errorRes.error) return of(new AuthAction.AuthenticateFailure(errorMsg));

  switch (message) {
    case 'USER_EXIST':
      errorMsg = 'This username is already in use!';
      break;

    case 'USER_NOT_FOUND':
      errorMsg = "Username name doesn't exist!";
      break;

    case 'INVALID_USERNAME':
      errorMsg = 'Username is either less than length of 3 or invalid!';
      break;

    case 'INVALID_ORIGIN':
      errorMsg = 'Invalid server origin!';
      break;

    case 'INVALID_CLIENTDATAJSON':
      errorMsg = 'Invalid server origin!';
      break;

    case 'INVALID_BIOMETRIC':
      errorMsg = 'Invalid biometric cridential!';
      break;

    case 'SHORT_AUTHDATA_BYTE':
      errorMsg = 'Authenticator data length is too short!';
      break;
  }

  return of(new AuthAction.AuthenticateFailure(errorMsg));
};

@Injectable()
export class AuthEffects {
  constructor(
    private action$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  authSignup = createEffect(() =>
    this.action$.pipe(
      ofType(AuthAction.SIGNUP_START),
      switchMap((action: AuthAction.SignupStart) => {
        return this.http
          .post<PublicKeyCredentialCreationOptions>(
            environment.restApiAddress + '/webauthn-reg',
            {
              username: action.payload.toLowerCase(),
            }
          )
          .pipe(
            map((resData) => {
              return new AuthAction.WebAuthReg(resData);
            }),
            catchError(handleError)
          );
      })
    )
  );

  webauthnReg = createEffect(() =>
    this.action$.pipe(
      ofType(AuthAction.WEBAUTH_REG),
      switchMap((action: AuthAction.WebAuthReg) => {
        const createCredentialDefaultArgs = { ...action.payload };

        const credentials: PublicKeyCredentialCreationOptions = {
          ...createCredentialDefaultArgs,
          challenge: Uint8Array.from(
            (<any>createCredentialDefaultArgs).challenge,
            (c: any) => c.charCodeAt(0)
          ),
          user: {
            ...createCredentialDefaultArgs.user,
            id: Uint8Array.from(
              atob((<any>createCredentialDefaultArgs).user.id),
              (c: any) => c.charCodeAt(0)
            ),
          },
        };

        return navigator.credentials
          .create({ publicKey: credentials })
          .then(
            (resData: PubCredential) =>
              new AuthAction.WebAuthRegVerifiation(resData)
          )
          .catch((err: DOMException) => {
            return new AuthAction.AuthenticateFailure(
              'An unknown error occured!'
            );
          });
      })
    )
  );

  webauthnRegVerification = createEffect(() =>
    this.action$.pipe(
      ofType(AuthAction.WEBAUTH_REG_VERIFICATION),
      switchMap((action: AuthAction.WebAuthRegVerifiation) => {
        const { response } = action.payload;
        const credential = {
          response: {
            clientDataJSON: bufferToBase64URLString(response.clientDataJSON),
            attestationObject: bufferToBase64URLString(
              response.attestationObject
            ),
          },
        };

        return this.http
          .post<{ message: string }>(
            environment.restApiAddress + '/webauthn-reg-verification',
            {
              credential,
            }
          )
          .pipe(
            map((resData) => {
              return new AuthAction.SignupSuccess({
                message: resData.message,
              });
            }),
            catchError(handleError)
          );
      })
    )
  );

  authLogin = createEffect(() =>
    this.action$.pipe(
      ofType(AuthAction.LOGIN_START),
      switchMap((action: AuthAction.LoginStart) => {
        return this.http
          .post<PublicKeyCredentialRequestOptions>(
            environment.restApiAddress + '/webauthn-login',
            {
              username: action.payload,
            }
          )
          .pipe(
            map((resData) => {
              return new AuthAction.WebaauthnLogin(resData);
            }),
            catchError(handleError)
          );
      })
    )
  );

  webauthnLogin = createEffect(() =>
    this.action$.pipe(
      ofType(AuthAction.WEBAUTH_LOGIN),
      switchMap((action: AuthAction.WebaauthnLogin) => {
        const createCredentialDefaultArgs = action.payload;
        const credentials: PublicKeyCredentialRequestOptions = {
          ...createCredentialDefaultArgs,
          challenge: base64URLStringToBuffer(
            (<any>createCredentialDefaultArgs).challenge
          ),

          allowCredentials: [
            {
              ...createCredentialDefaultArgs.allowCredentials[0],
              id: base64URLStringToBuffer(
                (<any>createCredentialDefaultArgs).allowCredentials[0].id
              ),
            },
          ],
        };

        return navigator.credentials
          .get({ publicKey: credentials })
          .then(
            (resData: PubRequestCredential) =>
              new AuthAction.WebaauthnLoginVerification(resData)
          )
          .catch((err: DOMException) => {
            console.log(err.message);
            return new AuthAction.AuthenticateFailure(
              'An unknown error occured!'
            );
          });
      })
    )
  );

  webauthnLoginVerification = createEffect(() =>
    this.action$.pipe(
      ofType(AuthAction.WEBAUTH_LOGIN_VERIFICATION),
      switchMap((action: AuthAction.WebaauthnLoginVerification) => {
        const resData = action.payload;
        const credential = {
          id: resData.id,
          response: {
            authenticatorData: bufferToBase64URLString(
              resData.response.authenticatorData
            ),
            clientDataJSON: bufferToBase64URLString(
              resData.response.clientDataJSON
            ),
            signature: bufferToBase64URLString(resData.response.signature),
            userHandle: bufferToBase64URLString(resData.response.userHandle),
          },
        };

        return this.http
          .post<AuthResponseData>(
            environment.restApiAddress + '/webauthn-login-verification',
            {
              credential,
            }
          )
          .pipe(
            map((resData) => {
              return handleAuthentication(
                resData.id,
                resData.name,
                resData.token,
                resData.expiresIn,
                resData.message
              );
            }),
            catchError(handleError)
          );
      })
    )
  );

  SignupSuccess = createEffect(
    () => {
      return this.action$.pipe(
        ofType(AuthAction.SIGNUP_SUCCESS),
        tap(() => {
          this.router.navigate(['/login']);
        })
      );
    },
    { dispatch: false }
  );

  loginSucces = createEffect(
    () =>
      this.action$.pipe(
        ofType(AuthAction.LOGIN_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.action$.pipe(
      ofType(AuthAction.AUTO_LOGIN),
      map(() => {
        const userData: {
          id: string;
          username: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (userData) {
          const loadedUser = new User(
            userData.id,
            userData.username,
            userData._token,
            new Date(userData._tokenExpirationDate)
          );

          if (loadedUser.token) {
            const expirationDuration =
              new Date(userData._tokenExpirationDate).getTime() -
              new Date().getTime();

            return new AuthAction.LoginSuccess({
              user: loadedUser,
              message: null,
              expiration: expirationDuration,
            });
          }
        }

        return { type: 'DUMMY' };
      })
    )
  );

  loginSucess = createEffect(() =>
    this.action$.pipe(
      ofType(AuthAction.LOGIN_SUCCESS),
      map((action: AuthAction.LoginSuccess) => {
        return new AuthAction.AutoLogout(action.payload.expiration);
      })
    )
  );

  autoLogout = createEffect(() =>
    this.action$.pipe(
      ofType(AuthAction.AUTO_LOGOUT),
      switchMap((action: AuthAction.AutoLogout) => {
        const expirationDuration = action.payload;

        return of('login').pipe(
          delay(expirationDuration),
          map(() => {
            localStorage.removeItem('userData');
            this.router.navigate(['/login']);
            return new AuthAction.Logout();
          })
        );
      })
    )
  );
}
