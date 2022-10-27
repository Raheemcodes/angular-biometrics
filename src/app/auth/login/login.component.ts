import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, AuthState } from 'src/app/shared/shared.model';
import { LoginStart } from '../store/auth.action';
import * as AuthActions from '../store/auth.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./../signup/signup.component.sass'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean = false;
  storeSub: Subscription;
  error: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.minLength(3),
        Validators.required,
      ]),
    });

    this.storeSub = this.store.select('auth').subscribe((state: AuthState) => {
      this.loading = state.loading;
      this.error = state.authError;
    });
  }

  onSubmit() {
    if (!this.loading) {
      const { username } = this.loginForm.value;

      this.store.dispatch(new LoginStart(username));
    }
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
