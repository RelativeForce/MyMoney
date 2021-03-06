import { Component } from '@angular/core';
import { TransactionService } from 'src/app/shared/services';
import { TransactionImportDataProvider } from './transaction-import-data-provider';

@Component({
   templateUrl: './import-transactions.component.html'
})
export class ImportTransactionsComponent {
   public dataProvider: TransactionImportDataProvider;

   constructor(transactionService: TransactionService) {
      this.dataProvider = new TransactionImportDataProvider(transactionService);
   }
}
