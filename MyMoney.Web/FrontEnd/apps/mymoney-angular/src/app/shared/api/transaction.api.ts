import { Injectable } from '@angular/core';
import { TransactionApi as CommonTransactionApi }  from '@mymoney-common/api'
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class TransactionApi extends CommonTransactionApi {
   constructor(api: HttpHelper) {
      super(api);
   }
}
