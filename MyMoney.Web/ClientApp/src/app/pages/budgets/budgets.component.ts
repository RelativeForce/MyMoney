import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../../shared/services';
import { BudgetViewModel } from '../../shared/classes';
import { BudgetListResponse, DeleteResponse } from '../../shared/interfaces';

@Component({
   templateUrl: './budgets.component.html'
})
export class BudgetsComponent implements OnInit {

   public budgets: Array<BudgetViewModel> = [];
   public year: Number;
   public month: Number;
   public monthIdForm: FormGroup;
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

      this.defaultMonth();
   }

   private defaultMonth(): void {

      const today = new Date();

      this.year = today.getFullYear();
      this.month = today.getMonth() + 1;
   }

   public ngOnInit(): void {
      this.monthIdForm = this.formBuilder.group({
         year: [this.year, Validators.required],
         month: [this.month, Validators.required]
      });

      this.fetchBudgets();
   }

   public get f() { return this.monthIdForm.controls; }

   public delete(id: Number): void {

      this.loading = true;

      this.http
         .post<DeleteResponse>(`/Budget/Delete`, { id })
         .subscribe(response => {

            if (response.success) {
               this.budgets = this.budgets.filter(v => v.id !== id);
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

      if (this.monthIdForm.invalid || this.f.year.value < 0 || this.f.month.value < 0 || this.f.month.value > 12) {
         return;
      }

      this.year = this.f.year.value;
      this.month = this.f.month.value;

      this.loading = true;

      this.fetchBudgets();
   }

   private fetchBudgets(): void {

      const monthStr = this.month < 10 ? '0' + this.month : this.month;

      this.http
         .post<BudgetListResponse>(`/Budget/List`, { monthId: '' + this.year + monthStr })
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
