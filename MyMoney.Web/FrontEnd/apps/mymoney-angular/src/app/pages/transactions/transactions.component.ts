import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../shared/services';
import { TransactionViewModel } from '@mymoney-common/classes';
import { Store } from '@ngrx/store';
import { IAppState } from '../../shared/state/app-state';
import { selectTransactions, selectTransactionsDateRange } from '../../shared/state/selectors/transaction.selector';
import { IDateRangeModel } from '../../shared/state/types';
import { toDateString } from '@mymoney-common/functions';

@Component({
   templateUrl: './transactions.component.html',
   styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

   public transactions: TransactionViewModel[] = [];
   public dateRange: IDateRangeModel = { start: new Date(), end: new Date() };
   public dateRangeForm: FormGroup;
   public dateRangeFormControls = {
      start: new FormControl(toDateString(this.dateRange.start), [Validators.required]),
      end: new FormControl(toDateString(this.dateRange.end), [Validators.required])
   }
   public loading = false;
   public submitted = false;

   constructor(
      private readonly transactionService: TransactionService,
      private readonly store: Store<IAppState>
   ) {
      this.dateRangeForm = new FormGroup(this.dateRangeFormControls);
   }

   public ngOnInit(): void {
      this.store
         .select(selectTransactions)
         .subscribe((transactions) => {
            this.transactions = transactions.map(t => new TransactionViewModel(t));
            this.loading = false;
         });

      this.store
         .select(selectTransactionsDateRange)
         .subscribe((dateRange) => {
            this.dateRange = dateRange;

            this.dateRangeFormControls.start.setValue(toDateString(dateRange.start));
            this.dateRangeFormControls.end.setValue(toDateString(dateRange.end));
         });

      this.transactionService.refreshTransactions();
   }

   public get start(): string {
      return this.formatDate(this.dateRange.start);
   }

   public get end(): string {
      return this.formatDate(this.dateRange.end);
   }

   public updateTransactions(): void {

      this.submitted = true;

      if (this.dateRangeForm.invalid) {
         return;
      }

      this.loading = true;

      this.dateRange = { 
         start: new Date(this.dateRangeFormControls.start.value ?? ''),
         end: new Date(this.dateRangeFormControls.end.value ?? '')
      };

      this.transactionService.updateDateRange(this.dateRange);
   }

   public deleteRecurringTransaction(id: number): void {
      if (!confirm(`Delete recurring transaction ${id}?`)) {
         return;
      }

      this.transactionService.deleteRecurringTransaction(id);
   }

   public deleteTransaction(id: number): void {
      if (!confirm(`Delete transaction ${id}?`)) {
         return;
      }

      this.transactionService.deleteTransaction(id);
   }

   private formatDate(date: Date): string {

      const parsedDate = new Date(date);

      const month = parsedDate.getMonth() + 1;

      const day = parsedDate.getDate();

      const monthStr = month < 10 ? '0' + month : month;

      const dayStr = day < 10 ? '0' + day : day;

      return parsedDate.getFullYear() + '-' + monthStr + '-' + dayStr;
   }
}
