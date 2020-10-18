import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './shared/services';

@Component({ selector: 'mymoney-root', templateUrl: 'app.component.html' })
export class AppComponent {
   public isLoggedIn: Boolean;

   constructor(
      private readonly router: Router,
      private readonly authenticationService: AuthenticationService
   ) {
      this.authenticationService.currentUser.subscribe(
         (x) => (this.isLoggedIn = this.authenticationService.isLoggedIn)
      );
   }

   public logout(): void {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
   }
}
