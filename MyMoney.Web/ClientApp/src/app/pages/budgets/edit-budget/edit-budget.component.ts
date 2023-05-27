import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { minAmountValidator, monthValidator } from 'src/app/shared/common-validators';
import { BudgetService } from 'src/app/shared/services';
import { IBudgetModel } from 'src/app/shared/state/types';

@Component({
   templateUrl: './edit-budget.component.html'
})
export class EditBudgetComponent implements OnInit {

   public editBudgetForm: FormGroup;
   public editBudgetFormControls = {
      year: new FormControl(1980, [Validators.required, Validators.min(1980)]),
      month: new FormControl(1, [Validators.required, monthValidator]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      name: new FormControl('', [Validators.required]),
      notes: new FormControl('', [])
   };
   public loading = false;
   public submitted = false;
   public id = 0;

   constructor(
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
      private readonly budgetService: BudgetService,
   ) {
      this.editBudgetForm = new FormGroup(this.editBudgetFormControls);
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/budgets']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.disableForm();

         this.budgetService.findBudget(this.id).subscribe(response => {
            this.editBudgetFormControls.year.patchValue(response.year);
            this.editBudgetFormControls.month.patchValue(response.month);
            this.editBudgetFormControls.amount.patchValue(response.amount);
            this.editBudgetFormControls.name.patchValue(response.name);
            this.editBudgetFormControls.notes.patchValue(response.notes);
            this.enableForm();
         },
            error => {
               this.router.navigate(['/budgets']);
            });
      });
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editBudgetForm.invalid) {
         return;
      }

      this.loading = true;

      const budget: IBudgetModel = {
         month: this.editBudgetFormControls.month.value ?? 0,
         year: this.editBudgetFormControls.year.value ?? 0,
         name: this.editBudgetFormControls.name.value ?? '',
         amount: this.editBudgetFormControls.amount.value ?? 0,
         remaining: this.editBudgetFormControls.amount.value ?? 0,
         notes: this.editBudgetFormControls.notes.value ?? '',
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

   private disableForm() {
      this.editBudgetFormControls.year.disable();
      this.editBudgetFormControls.month.disable();
      this.editBudgetFormControls.amount.disable();
      this.editBudgetFormControls.name.disable();
      this.editBudgetFormControls.notes.disable();
   }

   private enableForm() {
      this.editBudgetFormControls.year.enable();
      this.editBudgetFormControls.month.enable();
      this.editBudgetFormControls.amount.enable();
      this.editBudgetFormControls.name.enable();
      this.editBudgetFormControls.notes.enable();
   }
}
