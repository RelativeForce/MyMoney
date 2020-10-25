import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetService } from 'src/app/shared/services';
import { IBudgetModel } from 'src/app/shared/state/types';

@Component({
   templateUrl: './edit.budgets.component.html'
})
export class EditBudgetsComponent implements OnInit {

   public editBudgetForm: FormGroup;
   public loading = false;
   public submitted = false;
   public id: number;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
      private readonly budgetService: BudgetService,
   ) {
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/budgets']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.budgetService.findBudget(this.id).subscribe(response => {
            this.editBudgetForm = this.formBuilder.group({
               year: [response.year, Validators.required],
               month: [response.month, Validators.required],
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

      const budget: IBudgetModel = {
         month: this.f.month.value,
         year: this.f.year.value,
         name: this.f.name.value,
         amount: this.f.amount.value,
         remaining: this.f.amount.value,
         notes: this.f.notes.value,
         id: this.id
      };

      this.budgetService.editBudget(budget).subscribe(success => {
         if (success) {
            this.router.navigate(['/budgets']);
         }
      },
         error => {
            // Show error
            this.loading = false;
         });

   }
}
