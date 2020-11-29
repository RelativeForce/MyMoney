import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from '../constants';
import { AuthenticationService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {

   constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router) { }

   public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

      const urlPath: string | undefined = route.url[0]?.path;

      const isAnonymousRoute: boolean = urlPath === LOGIN_PAGE_PATH || urlPath === REGISTER_PAGE_PATH;

      return this.authenticationService.checkSession().pipe(first(), map((isLoggedIn: boolean) => {

         if (isLoggedIn && isAnonymousRoute) {
            return this.router.createUrlTree(['/']);
         }

         if (!isLoggedIn && !isAnonymousRoute) {
            return this.router.createUrlTree(['/' + LOGIN_PAGE_PATH]);
         }

         // Allow user to access route
         return true;
      }));
   }
}
