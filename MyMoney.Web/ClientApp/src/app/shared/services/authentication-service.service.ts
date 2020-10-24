import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILoginResponseDto, IRegisterRequestDto } from '../api';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app-state';
import { ClearSessionAction, StartSessionAction } from '../state/actions';
import { selectCurrentSession } from '../state/selectors/session.selector';
import { ISessionModel } from '../state/types';
import { Router } from '@angular/router';
import { UserApi } from '../api/user.api';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
   constructor(private readonly userApi: UserApi, private readonly store: Store<IAppState>, private readonly router: Router) { }

   public login(email: string, password: string): Observable<boolean> {
      return this.userApi
         .login({ email, password })
         .pipe(map((response: ILoginResponseDto) => {
            if (response.success) {
               this.store.dispatch(new StartSessionAction(response.token, response.validTo));
            }

            return response.success;
         }));
   }

   public register(newUserData: IRegisterRequestDto): Observable<boolean> {
      return this.userApi
         .register(newUserData)
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
      this.router.navigate(['/login']);
   }
}
