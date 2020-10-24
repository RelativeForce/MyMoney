import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ILoginRequestDto, LoginResponse, RegisterRequest } from './dtos';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class UserApi {

   constructor(private readonly api: HttpHelper) { }

   public login(credentials: ILoginRequestDto): Observable<LoginResponse> {
      return this.api
         .post<ILoginRequestDto, LoginResponse>(`/User/Login`, credentials)
         .pipe(first());
   }

   public register(newUserData: RegisterRequest): Observable<LoginResponse> {
      return this.api
         .post<RegisterRequest, LoginResponse>(`/User/Register`, newUserData)
         .pipe(first());
   }
}
