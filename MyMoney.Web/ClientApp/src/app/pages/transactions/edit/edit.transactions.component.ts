import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService, TransactionService } from '../../../shared/services';
import { TransactionModel, BudgetListResponse } from '../../../shared/interfaces';
import { BudgetViewModel } from '../../../shared/classes';

@Component({
   templateUrl: './edit.transactions.component.html'
})
export class EditTransactionsComponent implements OnInit {

   public editTransactionForm: FormGroup;
   public selectedBudgets: Set<Number> = new Set();
   public budgets: Array<BudgetViewModel> = [];
   public id: number;
   public loading = false;
   public submitted = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly authenticationService: AuthenticationService,
      private readonly transactionService: TransactionService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
      private readonly http: HttpClient
   ) {

      if (!this.authenticationService.isLoggedIn) {
         this.router.navigate(['/login']);
      }
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/transactions']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.transactionService
            .findTransaction(this.id)
            .subscribe((response: TransactionModel) => {

               response.budgetIds.forEach(bid => this.selectedBudgets.add(bid));

               this.editTransactionForm = this.formBuilder.group({
                  date: [this.toInputDateString(response.date), Validators.required],
                  description: [response.description, Validators.required],
                  amount: [response.amount, Validators.required]
               });

               this.fetchBudgets();
            },
               error => {
                  this.router.navigate(['/transactions']);
               });
      });
   }

   public get f() { return this.editTransactionForm.controls; }

   public onCheckboxChange(e, id: number): void {
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

   public toInputDateString(text: string): string {
      const date = new Date(text);

      const month = date.getMonth() + 1;

      const monthStr = month < 10 ? '0' + month : month;

      const day = date.getDate();

      const dayStr = day < 10 ? '0' + day : day;

      return date.getFullYear() + '-' + monthStr + '-' + dayStr;
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

   private get asTransactionModel(): TransactionModel {
      const date = this.f.date.value;
      const description = this.f.description.value;
      const amount = this.f.amount.value;

      return { date, description, amount, id: this.id, budgetIds: Array.from(this.selectedBudgets) };
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editTransactionForm.invalid) {
         return;
      }

      this.loading = true;

      this.transactionService
         .editTransaction(this.asTransactionModel)
         .subscribe(success => {
            if (success) {
               this.router.navigate(['/transactions']);
            }
         },
            error => {
               // Show error
               this.loading = false;
            });
   }
}
