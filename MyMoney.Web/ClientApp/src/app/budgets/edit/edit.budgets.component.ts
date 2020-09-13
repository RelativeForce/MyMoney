import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from '../../authentication.service';
import { BudgetModel } from '../../models/budget.model';

@Component({
   templateUrl: './edit.budgets.component.html'
})
export class EditBudgetsComponent implements OnInit {

   public editBudgetForm: FormGroup;
   public loading = false;
   public submitted = false;
   public id: Number;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly authenticationService: AuthenticationService,
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
            this.router.navigate(['/budgets']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.http
            .post<BudgetModel>(`/Budget/Find`, { id: this.id })
            .subscribe(response => {

               const monthId = response.monthId;

               const year = Number.parseInt(monthId.slice(0, 4), 10);
               const v = monthId.slice(3, 6);
               const month = Number.parseInt(v, 10);

               this.id = response.id;

               this.editBudgetForm = this.formBuilder.group({
                  year: [year, Validators.required],
                  month: [month, Validators.required],
                  amount: [response.amount, Validators.required],
                  name: [response.name, Validators.required],
                  notes: [response.notes, Validators.required]
               });
            },
               error => {
                  this.router.navigate(['/budgets']);
               });
      });
   }

   public get f() { return this.editBudgetForm.controls; }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editBudgetForm.invalid || this.f.year.value < 0 || this.f.month.value < 0 || this.f.month.value > 12) {
         return;
      }

      this.loading = true;

      const monthId = '' + this.f.year.value + (this.f.month.value < 10 ? '0' + this.f.month.value : this.f.month.value);

      const budget: BudgetModel = {
         monthId,
         name: this.f.name.value,
         amount: this.f.amount.value,
         remaining: this.f.amount.value,
         notes: this.f.notes.value,
         id: this.id
      };

      this.http
         .post<BudgetModel>(`/Budget/Update`, budget)
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
