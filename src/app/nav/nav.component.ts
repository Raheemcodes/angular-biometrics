import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppState, User } from '../shared/shared.model';
import { Store } from '@ngrx/store';
import { AutoLogout, Logout } from '../auth/store/auth.action';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user: User;
  support: boolean = !!window.PublicKeyCredential;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe(({ user }) => (this.user = user));
  }

  logout() {
    this.store.dispatch(new AutoLogout(0));
  }
}
