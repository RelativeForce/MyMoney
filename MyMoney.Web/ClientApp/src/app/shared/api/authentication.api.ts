import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IForgotPasswordDto, ILoginDto, ILoginResultDto, IRegisterDto, IUserDto } from './dtos.interface';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class AuthenticationApi {

   constructor(private readonly api: HttpHelper) { }

   public login(credentials: ILoginDto): Observable<ILoginResultDto> {
      return this.api
         .post<ILoginDto, ILoginResultDto>('/Authentication/Login', credentials)
         .pipe(first());
   }

   public register(newUserData: IRegisterDto): Observable<ILoginResultDto> {
      return this.api
         .post<IRegisterDto, ILoginResultDto>('/Authentication/Register', newUserData)
         .pipe(first());
   }

   public forgotPassword(email: IForgotPasswordDto): Observable<void> {
      return this.api
         .post<IForgotPasswordDto, void>('/Authentication/ForgotPassword', email)
         .pipe(first());
   }
}
