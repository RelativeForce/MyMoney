import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../../authentication.service';
import { TransactionModel } from '../../models/transaction.model';
import { BudgetViewModel } from '../../models/budget.view.model';
import { BudgetListResponse } from '../../models/budget.list.response';

@Component({
  selector: 'edit-transactions-component',
  templateUrl: './edit.transactions.component.html'
})
export class EditTransactionsComponent implements OnInit {

  editTransactionForm: FormGroup;
  selectedBudgets: Set<Number> = new Set();
  budgets: Array<BudgetViewModel> = [];
  id: Number;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {

    if (!this.authenticationService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      var idStr = params['id'];

      if (!idStr) {
        this.router.navigate(['/transactions']);
      }

      this.id = Number.parseInt(idStr);

      this.http
        .post<TransactionModel>(`/Transaction/Find`, { id: this.id })
        .subscribe(response => {

          response.budgetIds.forEach(bid => this.selectedBudgets.add(bid));

          this.editTransactionForm = this.formBuilder.group({
            date: [this.toInputDateString(response.date), Validators.required],
            description: [response.description, Validators.required],
            amount: [response.amount, Validators.required]
          });

          this.fetchbudgets();
        },
          error => {
            this.router.navigate(['/transactions']);
          });
    });


  }

  get f() { return this.editTransactionForm.controls; }

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

  toInputDateString(text): String {
    var date = new Date(text);

    var month = date.getMonth() + 1;

    var monthStr = month < 10 ? "0" + month : month;

    var day = date.getDate();

    var dayStr = day < 10 ? "0" + day : day;

    return date.getFullYear() + "-" + dayStr + "-" + monthStr;
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
    if (this.editTransactionForm.invalid) {
      return;
    }

    this.loading = true;

    // Login here
    var date = this.f.date.value;
    var description = this.f.description.value;
    var amount = this.f.amount.value;

    var transaction: TransactionModel = { date, description, amount, id: this.id, budgetIds: Array.from(this.selectedBudgets) };

    this.http
      .post<TransactionModel>(`/Transaction/Update`, transaction)
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
