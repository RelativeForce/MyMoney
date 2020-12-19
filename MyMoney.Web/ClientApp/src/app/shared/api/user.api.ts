import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IUserDto } from './dtos.interface';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class UserApi {

   constructor(private readonly api: HttpHelper) { }

   public currentUserDetails(): Observable<IUserDto> {
      return this.api
         .post<undefined, IUserDto>('/User/Details', undefined)
         .pipe(first());
   }
}
