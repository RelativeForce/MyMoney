import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LoginResponse, RegisterRequest } from '../api';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app-state';
import { ClearSessionAction, StartSessionAction } from '../state/actions';
import { selectCurrentSession } from '../state/selectors/session.selector';
import { ISessionModel } from '../state/types';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
   constructor(private readonly http: HttpClient, private readonly store: Store<IAppState>, private readonly router: Router) { }

   public login(email: string, password: string): Observable<boolean> {
      return this.http
         .post<LoginResponse>(`/User/Login`, { email, password })
         .pipe(first(), map((response) => {
            if (response.success) {
               this.store.dispatch(new StartSessionAction(response.token, response.validTo));
            }

            return response.success;
         })
         );
   }

   public register(newUserData: RegisterRequest): Observable<boolean> {
      return this.http
         .post<LoginResponse>(`/User/Register`, newUserData)
         .pipe(first(), map(response => {
            if (response.success) {
               this.store.dispatch(new StartSessionAction(response.token, response.validTo));
            }

            return response.success;
         }));
   }

   public isLoggedIn(): Observable<boolean> {
      return this.store.select(selectCurrentSession).pipe(map((s: ISessionModel | null) => s !== null));
   }

   public logout(): void {
      this.store.dispatch(new ClearSessionAction());
      this.router.navigate(['/login']);
   }
}
