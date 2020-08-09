import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../../authentication.service';
import { TransactionModel } from '../../models/transaction.model';
import { BudgetModel } from '../../models/budget.model';
import { BudgetViewModel } from '../../models/budget.view.model';
import { BudgetListResponse } from '../../models/budget.list.response';

@Component({
  selector: 'add-transactions-component',
  templateUrl: './add.transactions.component.html'
})
export class AddTransactionsComponent implements OnInit {

  addTransactionForm: FormGroup;
  selectedBudgets: Set<Number> = new Set();
  budgets: Array<BudgetViewModel> = [];
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private http: HttpClient
  ) {

    if (!this.authenticationService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.addTransactionForm = this.formBuilder.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  get f() { return this.addTransactionForm.controls; }

  onCheckboxChange(e, id) {
    if (e.target.checked) {
      this.selectedBudgets.add(id);
    } else {
      this.selectedBudgets.delete(id);
    }
  }

  onDateChange(e) {

    this.selectedBudgets.clear();

    this.fetchbudgets();
  }

  fetchbudgets(): void {

    this.loading = false;

    var date = new Date(this.f.date.value);

    var month = date.getMonth() + 1;

    var monthStr = month < 10 ? "0" + month : month;

    var monthId = "" + date.getFullYear() + monthStr;

    this.http
      .post<BudgetListResponse>(`/Budget/List`, { monthId })
      .subscribe(response => {

        this.budgets = response.budgets.map(t => new BudgetViewModel(t));
        this.loading = false;
      },
        error => {
          // TODO: Show error
          this.loading = false;
        });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addTransactionForm.invalid) {
      return;
    }

    this.loading = true;

    // Login here
    var date = this.f.date.value;
    var description = this.f.description.value;
    var amount = this.f.amount.value;

    var transaction: TransactionModel = { date, description, amount, id: 0, budgetIds: Array.from(this.selectedBudgets) };

    this.http
      .post<TransactionModel>(`/Transaction/Add`, transaction)
      .subscribe(response => {
        if (response.id != 0) {
          this.router.navigate(["/transactions"]);
        }
      },
      error => {
        // Show error
        this.loading = false;
      });
  }
}