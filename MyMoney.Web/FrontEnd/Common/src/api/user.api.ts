import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IBasicResultDto, IPasswordDto, IUserDto } from './dtos/dtos.interface';
import { HttpHelper } from './http-helper.class';

export class UserApi {

   constructor(private readonly api: HttpHelper) { }

   public currentUserDetails(): Observable<IUserDto> {
      return this.api
         .post<undefined, IUserDto>('/User/SignedInUser', undefined)
         .pipe(first());
   }

   public updateCurrentUserDetails(user: IUserDto): Observable<IBasicResultDto> {
      return this.api
         .post<IUserDto, IBasicResultDto>('/User/UpdateSignedInUser', user)
         .pipe(first());
   }

   public changePassword(password: IPasswordDto): Observable<IBasicResultDto> {
      return this.api
         .post<IPasswordDto, IBasicResultDto>('/User/ChangePassword', password)
         .pipe(first());
   }
}
