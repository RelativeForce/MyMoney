import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../../shared/services';
import { DateRangeModel, TransactionListResponse, DeleteResponse } from '../../shared/interfaces';
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
      private readonly router: Router,
      private readonly http: HttpClient
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

   public delete(id: Number): void {

      this.loading = true;

      this.http
         .post<DeleteResponse>(`/Transaction/Delete`, { id })
         .subscribe(response => {

            if (response.success) {
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

   public fetchTransactions(): void {
      this.http
         .post<TransactionListResponse>(`/Transaction/List`, this.dateRange)
         .subscribe(response => {

            this.transactions = response.transactions.map(t => new TransactionViewModel(t));
            this.loading = false;
         },
            error => {
               // TODO: Show error
               this.loading = false;
            });
   }
}
