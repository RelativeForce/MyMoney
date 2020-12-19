import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ILoginDto, ILoginResultDto, IRegisterDto, IUserDto } from './dtos.interface';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class UserApi {

   constructor(private readonly api: HttpHelper) { }

   public login(credentials: ILoginDto): Observable<ILoginResultDto> {
      return this.api
         .post<ILoginDto, ILoginResultDto>('/User/Login', credentials)
         .pipe(first());
   }

   public register(newUserData: IRegisterDto): Observable<ILoginResultDto> {
      return this.api
         .post<IRegisterDto, ILoginResultDto>('/User/Register', newUserData)
         .pipe(first());
   }

   public currentUserDetails(): Observable<IUserDto> {
      return this.api
         .post<undefined, IUserDto>('/User/Details', undefined)
         .pipe(first());
   }
}
