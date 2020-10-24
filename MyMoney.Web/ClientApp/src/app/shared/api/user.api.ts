import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ILoginRequestDto, ILoginResponseDto, IRegisterRequestDto } from './dtos';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class UserApi {

   constructor(private readonly api: HttpHelper) { }

   public login(credentials: ILoginRequestDto): Observable<ILoginResponseDto> {
      return this.api
         .post<ILoginRequestDto, ILoginResponseDto>(`/User/Login`, credentials)
         .pipe(first());
   }

   public register(newUserData: IRegisterRequestDto): Observable<ILoginResponseDto> {
      return this.api
         .post<IRegisterRequestDto, ILoginResponseDto>(`/User/Register`, newUserData)
         .pipe(first());
   }
}
