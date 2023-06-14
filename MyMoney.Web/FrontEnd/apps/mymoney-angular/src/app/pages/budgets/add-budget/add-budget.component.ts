import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { minAmountValidator, monthValidator } from '../../../shared/common-validators';
import { BudgetService } from '../../../shared/services';
import { IBudgetModel } from '../../../shared/state/types';

@Component({
   templateUrl: './add-budget.component.html'
})
export class AddBudgetComponent implements OnInit {

   public addBudgetForm: FormGroup;
   public addBudgetFormControls = {
      year: new FormControl(1980, [Validators.required, Validators.min(1980)]),
      month: new FormControl(1, [Validators.required, monthValidator]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      name: new FormControl('', [Validators.required]),
      notes: new FormControl('', [])
   };
   public loading = false;
   public submitted = false;

   constructor(
      private readonly router: Router,
      private readonly budgetService: BudgetService,
   ) {
      this.addBudgetForm = new FormGroup(this.addBudgetFormControls);
   }

   public ngOnInit(): void {
      const today = new Date();

      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      this.addBudgetFormControls.year.setValue(year);
      this.addBudgetFormControls.month.setValue(month);
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.addBudgetForm.invalid) {
         return;
      }

      this.loading = true;

      const year = this.addBudgetFormControls.year.value ?? 0;
      const month = this.addBudgetFormControls.month.value ?? 0;
      const amount = this.addBudgetFormControls.amount.value ?? 0;
      const name = this.addBudgetFormControls.name.value ?? '';
      const notes = this.addBudgetFormControls.notes.value ?? '';

      const budget: IBudgetModel = {
         month,
         year,
         name,
         amount,
         remaining: amount,
         notes,
         id: 0
      };

      this.budgetService.addBudget(budget).subscribe((success: boolean) => {
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
