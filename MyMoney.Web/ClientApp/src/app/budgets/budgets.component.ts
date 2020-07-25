import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../authentication.service';
import { DateRangeModel } from '../models/date.range.model';
import { TransactionViewModel } from '../models/transaction.view.model';
import { BudgetViewModel } from '../models/budget.view.model';
import { BudgetListResponse } from '../models/budget.list.response';

@Component({
  selector: 'budgets-component',
  templateUrl: './budgets.component.html'
})
export class BudgetsComponent implements OnInit {

  budgets: Array<BudgetViewModel> = [];
  year: Number;
  month: Number;
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

    this.defaultMonth();
  }

  defaultMonth(): void {

    var today = new Date();

    this.year = today.getFullYear();
    this.month = today.getMonth();
  }

  ngOnInit() {
    this.dateRangeForm = this.formBuilder.group({
      year: [this.year, Validators.required],
      month: [this.month, Validators.required]
    });

    this.fetchbudgets();
  }

  get f() { return this.dateRangeForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.dateRangeForm.invalid || this.f.year.value < 0 || this.f.month.value < 0 || this.f.year.value > 12) {
      return;
    }

    this.year = this.f.year.value;
    this.month = this.f.month.value;

    this.loading = true;

    this.fetchbudgets();
  }

  fetchbudgets(): void {

    var monthStr = this.month < 10 ? "0" + this.month : this.month;

    this.http
      .post<BudgetListResponse>(`/Budget/List`, { monthId: "" + this.year + monthStr })
      .subscribe(response => {

        this.budgets = response.budgets.map(t => new BudgetViewModel(t));
        this.loading = false;
      },
        error => {
          // TODO: Show error
          this.loading = false;
        });
  }
}
