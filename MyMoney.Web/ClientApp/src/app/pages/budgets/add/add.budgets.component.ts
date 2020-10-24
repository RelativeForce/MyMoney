import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetService } from 'src/app/shared/services';
import { IBudgetModel } from 'src/app/shared/state/types';

@Component({
   templateUrl: './add.budgets.component.html'
})
export class AddBudgetsComponent implements OnInit {

   public addBudgetForm: FormGroup;
   public loading = false;
   public submitted = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly router: Router,
      private readonly budgetService: BudgetService,
   ) { }

   public ngOnInit(): void {

      const today = new Date();

      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      this.addBudgetForm = this.formBuilder.group({
         year: [year, Validators.required],
         month: [month, Validators.required],
         amount: ['', Validators.required],
         name: ['', Validators.required],
         notes: ['', Validators.required]
      });
   }

   public get f() { return this.addBudgetForm.controls; }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.addBudgetForm.invalid || this.f.year.value < 0 || this.f.month.value < 0 || this.f.month.value > 12) {
         return;
      }

      this.loading = true;

      const year = this.f.year.value;
      const month = this.f.month.value;
      const amount = this.f.amount.value;
      const name = this.f.name.value;
      const notes = this.f.notes.value;

      const monthId: string = this.budgetService.toMonthId(month, year);

      const budget: IBudgetModel = {
         monthId,
         name: name,
         amount: amount,
         remaining: amount,
         notes: notes,
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
