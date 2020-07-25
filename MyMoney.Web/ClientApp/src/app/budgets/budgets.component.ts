import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../authentication.service';
import { TransactionModel } from '../models/transaction.model';
import { DateRangeModel } from '../models/date.range.model';
import { TransactionListResponse } from '../models/transaction.list.response';
import { TransactionViewModel } from '../models/transaction.view.model';

@Component({
  selector: 'budgets-component',
  templateUrl: './budgets.component.html'
})
export class BudgetsComponent implements OnInit {

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

    var end: Date = new Date();

    var start: Date = new Date();
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

    var date = new Date(date);

    var month = date.getMonth() + 1;

    var day = date.getDate();

    var monthStr = month < 10 ? "0" + month : month;

    var dayStr = day < 10 ? "0" + day : day;

    return date.getFullYear() + "-" + monthStr + "-" + dayStr;
  }

  get start(): string {
    return this.formatDate(this.dateRange.start);
  }

  get end(): string {
    return this.formatDate(this.dateRange.end);
  }

  get f() { return this.dateRangeForm.controls; }

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
