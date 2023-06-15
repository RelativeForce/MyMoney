import { Injectable } from '@angular/core';
import { IncomeApi as CommonIncomeApi }  from '@mymoney-common/api'
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class IncomeApi extends CommonIncomeApi {
   constructor(api: HttpHelper) {
      super(api);
   }
}
