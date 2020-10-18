import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app-state';
import { ClearSessionAction, StartSessionAction } from '../state/actions';
import { RegisterRequest } from '../interfaces';
import { selectCurrentSession } from '../state/selectors/session.selector';
import { ISessionModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
   constructor(private readonly http: HttpClient, private readonly store: Store<IAppState>) { }

   public login(email: string, password: string): Observable<boolean> {
      return this.http
         .post<LoginResponse>(`/User/Login`, { email, password })
         .pipe(map((response) => {
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
         .pipe(map(response => {
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
   }
}
