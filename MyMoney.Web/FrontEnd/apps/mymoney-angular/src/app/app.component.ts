import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
   ActivatedRouteSnapshot,
   Router,
   RoutesRecognized,
} from '@angular/router';
import { CurrentUserService } from './shared/services';
import { IUser } from './shared/state/types';

@Component({
   selector: 'mymoney-root',
   templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
   public user: IUser | null;

   constructor(
      private readonly currentUserService: CurrentUserService,
      private readonly titleService: Title,
      private readonly router: Router
   ) {
      this.user = null;
   }

   public ngOnInit(): void {
      this.currentUserService
         .currentUser()
         .subscribe((user) => (this.user = user));

      this.router.events.subscribe((data) => {
         if (data instanceof RoutesRecognized) {
            const title: string | null = this.getTitle(data.state.root);
            if (title) {
               this.titleService.setTitle(`${title} - MyMoney`);
            } else {
               this.titleService.setTitle('MyMoney');
            }
         }
      });
   }

   public logout(): void {
      this.currentUserService.logout();
   }

   private getTitle(route: ActivatedRouteSnapshot): string | null {
      const title: string | null = route.title ?? null;

      for (const childRoute of route.children) {
         const childTitle = this.getTitle(childRoute);

         if (childTitle) {
            return childTitle;
         }
      }

      return title;
   }
}
