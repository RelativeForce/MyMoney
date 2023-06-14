import { Component } from '@angular/core';
import { TransactionService } from '../../../shared/services';
import { TransactionImportDataProvider } from './transaction-import-data-provider';

@Component({
   selector: 'mymoney-import-transactions',
   templateUrl: './import-transactions.component.html'
})
export class ImportTransactionsComponent {
   public dataProvider: TransactionImportDataProvider;

   constructor(transactionService: TransactionService) {
      this.dataProvider = new TransactionImportDataProvider(transactionService);
   }
}
