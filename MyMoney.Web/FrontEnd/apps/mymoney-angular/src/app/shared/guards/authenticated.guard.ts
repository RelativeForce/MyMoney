import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AuthenticationService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {
   constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router) {}

   public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
      const isAnonymousRoute: boolean = route.data['isAnonymous'] ?? false;
      return this.authenticationService.checkSession().pipe(
         first(),
         map((isLoggedIn: boolean) => {
            if (isLoggedIn && isAnonymousRoute) {
               return this.router.createUrlTree(['/']);
            }

            if (!isLoggedIn && !isAnonymousRoute) {
               return this.router.createUrlTree(['/auth/login']);
            }

            // Allow user to access route
            return true;
         })
      );
   }
}
