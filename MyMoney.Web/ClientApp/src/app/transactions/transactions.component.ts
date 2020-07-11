import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../authentication.service';
import { TransactionModel } from '../models/transaction.model';
import { DateRangeModel } from '../models/date.range.model';
import { TransactionListResponse } from '../models/transaction.list.response';

@Component({
  selector: 'transactions-component',
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {

  transactions: Array<TransactionModel> = [];
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

    var end: Date = new Date();

    var start: Date = new Date();
    start.setMonth(start.getMonth() - 1);

    return { end, start };
  }

  ngOnInit() {
    this.dateRangeForm = this.formBuilder.group({
      start: [this.dateRange.start, Validators.required],
      end: [this.dateRange.end, Validators.required]
    });

    this.fetchTransactions();
  }

  get f() { return this.dateRangeForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
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

        this.transactions = response.transactions;
        this.dateRange = response.dateRange;
        this.loading = false;
      },
        error => {
          // Show error
          this.loading = false;
        });
  }
}
