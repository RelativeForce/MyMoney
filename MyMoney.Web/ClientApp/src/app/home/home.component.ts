import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (!this.authenticationService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
}
