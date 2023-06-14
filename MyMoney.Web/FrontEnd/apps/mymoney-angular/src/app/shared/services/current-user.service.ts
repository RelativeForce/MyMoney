import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IBasicResultDto, IUserDto } from '@mymoney/common';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app-state';
import { ClearSessionAction, SetUserAction } from '../state/actions';
import { selectCurrentUser, selectSessionState } from '../state/selectors/session.selector';
import { IUser } from '../state/types';
import { Router } from '@angular/router';
import { UserApi } from '../api';
import { ISessionState } from '../state/reducers';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
   constructor(private readonly userApi: UserApi, private readonly store: Store<IAppState>, private readonly router: Router) {
      this.store.select(selectSessionState)
         .pipe(filter((state: ISessionState) => state.currentUser === null && state.currentSession !== null))
         .subscribe(() => this.userApi
            .currentUserDetails()
            .subscribe((user: IUserDto) => this.store.dispatch(new SetUserAction(user))));
   }

   public currentUser(): Observable<IUser | null> {
      return this.store.select(selectCurrentUser);
   }

   public updateCurrentUser(newData: IUser): Observable<IBasicResultDto> {
      return this.userApi.updateCurrentUserDetails(newData);
   }

   public updatePassword(newPassword: string): Observable<IBasicResultDto> {
      return this.userApi.changePassword({ password: newPassword });
   }

   public logout(): void {
      this.store.dispatch(new ClearSessionAction());
      this.router.navigate(['/auth/login']);
   }
}
