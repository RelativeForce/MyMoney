import { Injectable } from '@angular/core';
import { HttpHelper } from './http-helper.class';
import { BudgetApi as CommonBudgetApi } from '@mymoney/common';

@Injectable({ providedIn: 'root' })
export class BudgetApi extends CommonBudgetApi {
   constructor(api: HttpHelper) {
      super(api);
   }
}
