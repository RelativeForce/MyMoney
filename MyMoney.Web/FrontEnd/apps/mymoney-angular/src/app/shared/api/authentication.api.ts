import { Injectable } from '@angular/core';
import { HttpHelper } from './http-helper.class';
import { AuthenticationApi as CommonAuthenticationApi }  from '@mymoney-common/api';

@Injectable({ providedIn: 'root' })
export class AuthenticationApi extends CommonAuthenticationApi {
   constructor(api: HttpHelper) {
      super(api);
   }
}
