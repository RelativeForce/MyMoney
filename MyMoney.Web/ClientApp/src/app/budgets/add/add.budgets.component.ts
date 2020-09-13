import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../../authentication.service';
import { BudgetModel } from '../../models/budget.model';

@Component({
   templateUrl: './add.budgets.component.html'
})
export class AddBudgetsComponent implements OnInit {

   addBudgetForm: FormGroup;
   loading = false;
   submitted = false;
   year: Number;
   month: Number;
   name: string;
   notes: string;
   amount: Number;

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

   ngOnInit() {
      this.addBudgetForm = this.formBuilder.group({
         year: [this.year, Validators.required],
         month: [this.month, Validators.required],
         amount: [this.amount, Validators.required],
         name: [this.name, Validators.required],
         notes: [this.notes, Validators.required]
      });
   }

   defaultMonth(): void {

      const today = new Date();

      this.year = today.getFullYear();
      this.month = today.getMonth() + 1;
   }

   get f() { return this.addBudgetForm.controls; }

   onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.addBudgetForm.invalid || this.f.year.value < 0 || this.f.month.value < 0 || this.f.month.value > 12) {
         return;
      }

      this.loading = true;

      this.year = this.f.year.value;
      this.month = this.f.month.value;
      this.amount = this.f.amount.value;
      this.name = this.f.name.value;
      this.notes = this.f.notes.value;

      const monthId: string = '' + this.year + (this.month < 10 ? '0' + this.month : this.month);

      const budget: BudgetModel = {
         monthId,
         name: this.name,
         amount: this.amount,
         remaining: this.amount,
         notes: this.notes,
         id: 0
      };

      this.http
         .post<BudgetModel>(`/Budget/Add`, budget)
         .subscribe(response => {
            if (response.id !== 0) {
               this.router.navigate(['/budgets']);
            }
         },
            error => {
               // Show error
               this.loading = false;
            });
   }
}
