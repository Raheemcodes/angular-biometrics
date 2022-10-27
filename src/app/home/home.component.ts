import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, User } from '../shared/shared.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  constructor(private store: Store<AppState>) {}
  user: User;
  support: boolean = !!window.PublicKeyCredential;

  ngOnInit(): void {
    this.store.select('auth').subscribe((state) => {
      this.user = state.user;
    });
  }
}
