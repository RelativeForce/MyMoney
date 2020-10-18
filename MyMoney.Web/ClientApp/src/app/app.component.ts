import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './shared/services';

@Component({ selector: 'mymoney-root', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {

   public isLoggedIn: boolean;

   constructor(private readonly authenticationService: AuthenticationService) {
      this.isLoggedIn = false;
   }

   ngOnInit(): void {
      this.authenticationService.isLoggedIn().subscribe((isLoggedIn) => this.isLoggedIn = isLoggedIn);
   }
}
