import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../authentication.service';
import { DateRangeModel } from '../models/date.range.model';
import { TransactionListResponse } from '../models/transaction.list.response';
import { TransactionViewModel } from '../models/transaction.view.model';
import { DeleteResponse } from '../models/delete.response';

@Component({
   templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {

   transactions: Array<TransactionViewModel> = [];
   dateRange: DateRangeModel;
   dateRangeForm: FormGroup;
   loading: Boolean = false;
   submitted: Boolean = false;

   constructor(
      private formBuilder: FormBuilder,
      private authenticationService: AuthenticationService,
      private router: Router,
      private http: HttpClient
   ) {
      if (!this.authenticationService.isLoggedIn) {
         this.router.navigate(['/login']);
      }

      this.dateRange = this.defaultDateRange;
   }

   get defaultDateRange(): DateRangeModel {

      const end: Date = new Date();

      const start: Date = new Date();
      start.setMonth(start.getMonth() - 1);

      return { end, start };
   }

   ngOnInit() {
      this.dateRangeForm = this.formBuilder.group({
         start: [this.start, Validators.required],
         end: [this.end, Validators.required]
      });

      this.fetchTransactions();
   }

   formatDate(date: Date): string {

      const parsedDate = new Date(date);

      const month = parsedDate.getMonth() + 1;

      const day = parsedDate.getDate();

      const monthStr = month < 10 ? '0' + month : month;

      const dayStr = day < 10 ? '0' + day : day;

      return parsedDate.getFullYear() + '-' + monthStr + '-' + dayStr;
   }

   get start(): string {
      return this.formatDate(this.dateRange.start);
   }

   get end(): string {
      return this.formatDate(this.dateRange.end);
   }

   get f() { return this.dateRangeForm.controls; }

   delete(id: Number) {

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

   onSubmit() {
      this.submitted = true;

      if (this.dateRangeForm.invalid) {
         return;
      }

      this.loading = true;

      this.dateRange = { start: this.f.start.value, end: this.f.end.value };

      this.fetchTransactions();
   }

   fetchTransactions(): void {
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
