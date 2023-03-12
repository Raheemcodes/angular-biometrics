import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, AuthState } from 'src/app/shared/shared.model';
import * as AuthActions from '../store/auth.action';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  loading: boolean = false;
  storeSub: Subscription;
  error: string;

  // emailFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.email,
  // ]);
  // textFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.minLength(3),
  // ]);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
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
      const { username } = this.signupForm.value;

      this.store.dispatch(new AuthActions.SignupStart(username));
    }
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
