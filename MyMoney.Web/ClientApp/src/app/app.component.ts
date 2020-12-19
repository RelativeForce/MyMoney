import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './shared/services';
import { IUser } from './shared/state/types';

@Component({ selector: 'mymoney-root', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {

   public user: IUser | null;

   constructor(private readonly authenticationService: AuthenticationService) {
      this.user = null;
   }

   ngOnInit(): void {
      this.authenticationService.currentUser().subscribe((user) => this.user = user);
   }

   logout(): void {
      this.authenticationService.logout();
   }
}
