import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../shared/services';
import { TransactionViewModel } from '../../shared/classes';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/shared/state/app-state';
import { selectTransactions, selectTransactionsDateRange } from 'src/app/shared/state/selectors/transaction.selector';
import { IDateRangeModel } from '../../shared/state/types';

@Component({
   templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {

   public transactions: TransactionViewModel[] = [];
   public dateRange: IDateRangeModel;
   public dateRangeForm: FormGroup;
   public loading: Boolean = false;
   public submitted: Boolean = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly transactionService: TransactionService,
      private readonly store: Store<IAppState>
   ) { }

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

            this.dateRangeForm = this.formBuilder.group({
               start: [this.start, [Validators.required]],
               end: [this.end, [Validators.required]]
            });
         });

      this.transactionService.refreshTransactions();
   }

   public get start(): string {
      return this.formatDate(this.dateRange.start);
   }

   public get end(): string {
      return this.formatDate(this.dateRange.end);
   }

   public get f() {
      return this.dateRangeForm.controls;
   }

   public updateTransactions(): void {

      this.submitted = true;

      if (this.dateRangeForm.invalid) {
         return;
      }

      this.loading = true;

      this.dateRange = { start: this.f.start.value, end: this.f.end.value };

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
