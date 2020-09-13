import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
   templateUrl: './home.component.html',
})
export class HomeComponent {

   constructor(
      private readonly authenticationService: AuthenticationService,
      private readonly router: Router
   ) {
      // redirect to home if already logged in
      if (!this.authenticationService.isLoggedIn) {
         this.router.navigate(['/login']);
      }
   }
}
