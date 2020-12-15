import { Component } from '@angular/core';
import { IncomeService, TransactionService } from 'src/app/shared/services';
import { IncomeImportDataProvider } from "./income-import-data-provider";

@Component({
   templateUrl: './import.incomes.component.html'
})
export class ImportIncomesComponent {
   public dataProvider: IncomeImportDataProvider;

   constructor(incomeService: IncomeService) {
      this.dataProvider = new IncomeImportDataProvider(incomeService);
   }
}
