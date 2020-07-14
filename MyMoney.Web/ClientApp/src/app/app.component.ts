import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
  isLoggedIn: Boolean;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.isLoggedIn = this.authenticationService.isLoggedIn);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
