import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService, TransactionService } from '../../shared/services';
import { DateRangeModel } from '../../shared/interfaces';
import { TransactionViewModel } from '../../shared/classes';

@Component({
   templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {

   public transactions: Array<TransactionViewModel> = [];
   public dateRange: DateRangeModel;
   public dateRangeForm: FormGroup;
   public loading: Boolean = false;
   public submitted: Boolean = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly authenticationService: AuthenticationService,
      private readonly transactionService: TransactionService,
      private readonly router: Router
   ) {
      if (!this.authenticationService.isLoggedIn) {
         this.router.navigate(['/login']);
      }

      this.dateRange = this.defaultDateRange;
   }

   public get defaultDateRange(): DateRangeModel {

      const end: Date = new Date();

      const start: Date = new Date();
      start.setMonth(start.getMonth() - 1);

      return { end, start };
   }

   public ngOnInit(): void {
      this.dateRangeForm = this.formBuilder.group({
         start: [this.start, Validators.required],
         end: [this.end, Validators.required]
      });

      this.fetchTransactions();
   }

   private formatDate(date: Date): string {

      const parsedDate = new Date(date);

      const month = parsedDate.getMonth() + 1;

      const day = parsedDate.getDate();

      const monthStr = month < 10 ? '0' + month : month;

      const dayStr = day < 10 ? '0' + day : day;

      return parsedDate.getFullYear() + '-' + monthStr + '-' + dayStr;
   }

   public get start(): string {
      return this.formatDate(this.dateRange.start);
   }

   public get end(): string {
      return this.formatDate(this.dateRange.end);
   }

   public get f() { return this.dateRangeForm.controls; }

   public delete(id: number): void {

      this.loading = true;

      this.transactionService
         .deleteTransaction(id)
         .subscribe((isDeleted: boolean) => {

            if (isDeleted) {
               this.transactions = this.transactions.filter(v => v.id !== id);
            }

            this.loading = false;
         },
            error => {
               // TODO: Show error
               this.loading = false;
            });
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.dateRangeForm.invalid) {
         return;
      }

      this.loading = true;

      this.dateRange = { start: this.f.start.value, end: this.f.end.value };

      this.fetchTransactions();
   }

   private fetchTransactions(): void {
      this.transactionService
         .listTransactions(this.dateRange)
         .subscribe(transactions => {

            this.transactions = transactions;
            this.loading = false;
         },
            error => {
               // TODO: Show error
               this.loading = false;
            });
   }
}
