import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetService } from 'src/app/shared/services';
import { IBudgetModel } from 'src/app/shared/state/types';

@Component({
   templateUrl: './edit-budget.component.html'
})
export class EditBudgetComponent implements OnInit {

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

         this.editBudgetForm = this.formBuilder.group({
            year: [1980, [Validators.required, Validators.min(1980)]],
            month: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
            amount: [0.01, [Validators.required, Validators.min(0.01)]],
            name: ['', [Validators.required]],
            notes: ['', []]
         });

         this.disableForm();

         this.budgetService.findBudget(this.id).subscribe(response => {
            this.f.year.patchValue(response.year);
            this.f.month.patchValue(response.month);
            this.f.amount.patchValue(response.amount);
            this.f.name.patchValue(response.name);
            this.f.notes.patchValue(response.notes);
            this.enableForm();
         },
            error => {
               this.router.navigate(['/budgets']);
            });
      });
   }

   public get f() {
      return this.editBudgetForm.controls;
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editBudgetForm.invalid) {
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

   private disableForm() {
      this.f.year.disable();
      this.f.month.disable();
      this.f.amount.disable();
      this.f.name.disable();
      this.f.notes.disable();
   }

   private enableForm() {
      this.f.year.enable();
      this.f.month.enable();
      this.f.amount.enable();
      this.f.name.enable();
      this.f.notes.enable();
   }
}
