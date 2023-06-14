import { Injectable } from '@angular/core';
import { HomeApi as CommonHomeApi } from '@mymoney/common';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class HomeApi extends CommonHomeApi {
   constructor(api: HttpHelper) {
      super(api);
   }
}
