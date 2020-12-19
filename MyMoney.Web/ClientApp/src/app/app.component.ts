import { Component, OnInit } from '@angular/core';

import { CurrentUserService } from './shared/services';
import { IUser } from './shared/state/types';

@Component({ selector: 'mymoney-root', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {

   public user: IUser | null;

   constructor(private readonly currentUserService: CurrentUserService) {
      this.user = null;
   }

   public ngOnInit(): void {
      this.currentUserService.currentUser().subscribe((user) => this.user = user);
   }

   public logout(): void {
      this.currentUserService.logout();
   }
}
