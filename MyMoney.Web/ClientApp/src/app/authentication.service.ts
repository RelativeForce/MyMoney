import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './models/user';
import { LoginResponse } from './models/login.response';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
   public currentUserSubject: BehaviorSubject<User>;
   public currentUser: Observable<User>;

   constructor(private readonly http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<User>(
         JSON.parse(localStorage.getItem('currentUser'))
      );
      this.currentUser = this.currentUserSubject.asObservable();

      if (!this.isLoggedIn) {
         this.logout();
      }
   }

   public get currentUserValue(): User {
      return this.currentUserSubject.value;
   }

   public login(email: string, password: string): Observable<LoginResponse> {
      return this.http
         .post<LoginResponse>(`/User/Login`, { email, password })
         .pipe(
            map((response) => {
               if (response.success) {
                  this.setUser(email, response.token, response.validTo);
               }

               return response;
            })
         );
   }

   public get isLoggedIn(): Boolean {
      if (!this.currentUserValue) {
         return false;
      }

      const now = new Date(Date.now()).getTime();
      const validTo = Date.parse(this.currentUserValue.validTo);

      if (validTo > now) {
         return true;
      }

      this.logout();

      return false;
   }

   public setUser(email: string, token: string, validTo: string): void {
      const user: User = { email, token, validTo };

      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
   }

   public logout(): void {
      // remove user from local storage and set current user to null
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
   }
}
