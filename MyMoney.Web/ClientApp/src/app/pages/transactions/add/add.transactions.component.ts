import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BudgetListResponse } from '../../../shared/interfaces';
import { BudgetViewModel } from '../../../shared/classes';
import { ITransactionModel } from 'src/app/shared/state/types';
import { TransactionService } from 'src/app/shared/services';

@Component({
   templateUrl: './add.transactions.component.html'
})
export class AddTransactionsComponent implements OnInit {

   public addTransactionForm: FormGroup;
   public selectedBudgets: Set<number> = new Set();
   public budgets: BudgetViewModel[] = [];
   public loading = false;
   public submitted = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly router: Router,
      private readonly http: HttpClient,
      private readonly transactionService: TransactionService
   ) {
   }

   public ngOnInit(): void {
      this.addTransactionForm = this.formBuilder.group({
         date: ['', Validators.required],
         description: ['', Validators.required],
         amount: ['', Validators.required]
      });
   }

   public get f() { return this.addTransactionForm.controls; }

   public onCheckboxChange(e, id): void {
      if (e.target.checked) {
         this.selectedBudgets.add(id);
      } else {
         this.selectedBudgets.delete(id);
      }
   }

   public onDateChange(e): void {

      this.selectedBudgets.clear();

      this.fetchBudgets();
   }

   public fetchBudgets(): void {

      this.loading = false;

      const date = new Date(this.f.date.value);

      const month = date.getMonth() + 1;

      const monthStr = month < 10 ? '0' + month : month;

      const monthId = '' + date.getFullYear() + monthStr;

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

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.addTransactionForm.invalid) {
         return;
      }

      this.loading = true;

      // Login here
      const date = this.f.date.value;
      const description = this.f.description.value;
      const amount = this.f.amount.value;

      const transaction: ITransactionModel = { date, description, amount, id: 0, budgetIds: Array.from(this.selectedBudgets) };

      this.transactionService.addTransaction(transaction).subscribe(success => {
         if (success) {
            this.router.navigate(['/transactions']);
         }
         this.loading = false;
      },
         error => {
            // Show error
            this.loading = false;
         });
   }
}
