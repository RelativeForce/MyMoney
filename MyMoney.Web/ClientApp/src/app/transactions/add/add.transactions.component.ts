import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../../authentication.service';
import { TransactionModel } from '../../models/transaction.model';

@Component({
  selector: 'add-transactions-component',
  templateUrl: './add.transactions.component.html'
})
export class AddTransactionsComponent implements OnInit {

  addTransactionForm: FormGroup;
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

    this.http
      .post<TransactionModel>(`/Transaction/Add`, { date, description, amount, id: 0 })
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
