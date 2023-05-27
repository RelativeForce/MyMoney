import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IBasicResultDto, IForgotPasswordDto, ILoginDto, ILoginResultDto, IPasswordDto, IRegisterDto } from './dtos.interface';
import { HttpHelper } from './http-helper.class';


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

   public resetPassword(newPassword: IPasswordDto, userToken: string): Observable<IBasicResultDto> {
      return this.api
         .post<IPasswordDto, IBasicResultDto>('/User/ChangePassword', newPassword, userToken)
         .pipe(first());
   }
}
