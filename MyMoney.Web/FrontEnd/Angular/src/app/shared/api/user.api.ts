import { Injectable } from '@angular/core';
import { UserApi as CommonUserApi } from 'mymoney-common/lib/api';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class UserApi extends CommonUserApi {
   constructor(api: HttpHelper) {
      super(api);
   }
}
