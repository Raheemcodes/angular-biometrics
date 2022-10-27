import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AutoLogin, HandleError } from './auth/store/auth.action';
import { AppState, AuthState } from './shared/shared.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'angular-webauthn';
  success: string;
  error: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(new AutoLogin());

    this.store.select('auth').subscribe((state: AuthState) => {
      this.success = state.authSuccess;
      this.error = state.authError;
    });
  }

  onClose() {
    this.store.dispatch(new HandleError());
  }
}
