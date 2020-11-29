import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetService, IncomeService } from '../../../shared/services';
import { BudgetViewModel } from '../../../shared/classes';
import { IIncomeModel } from 'src/app/shared/state/types';

@Component({
   templateUrl: './edit.incomes.component.html'
})
export class EditIncomesComponent implements OnInit {

   public editIncomeForm: FormGroup;
   public selectedBudgets: Set<number> = new Set();
   public budgets: BudgetViewModel[] = [];
   public id: number;
   public loading = false;
   public submitted = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly incomeService: IncomeService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute
   ) {
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/incomes']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.editIncomeForm = this.formBuilder.group({
            date: ['', Validators.required],
            name: ['', Validators.required],
            amount: ['', Validators.required],
         });

         this.disableForm();

         this.incomeService
            .findIncome(this.id)
            .subscribe((response: IIncomeModel) => {

               this.f.date.patchValue(this.toInputDateString(response.date));
               this.f.name.patchValue(response.name);
               this.f.amount.patchValue(response.amount);
               this.enableForm();
            },
               () => {
                  this.router.navigate(['/incomes']);
               });
      });
   }

   private disableForm() {
      this.f.amount.disable();
      this.f.name.disable();
      this.f.date.disable();
   }

   private enableForm() {
      this.f.amount.enable();
      this.f.name.enable();
      this.f.date.enable();
   }

   public get f() { return this.editIncomeForm.controls; }

   public toInputDateString(text: string): string {
      const month = Number.parseInt(text.split('/')[1], 10);

      const monthStr = month < 10 ? '0' + month : month;

      const day = Number.parseInt(text.split('/')[0], 10);

      const dayStr = day < 10 ? '0' + day : day;

      return text.split('/')[2] + '-' + monthStr + '-' + dayStr;
   }

   private get asIncomeModel(): IIncomeModel {

      const date = new Date(this.f.date.value);

      const dateString: string = date.toLocaleDateString();

      const name = this.f.name.value;
      const amount = this.f.amount.value;

      return {
         date: dateString,
         name,
         amount,
         id: this.id,
      };
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editIncomeForm.invalid) {
         return;
      }

      this.loading = true;

      this.incomeService
         .editIncome(this.asIncomeModel)
         .subscribe(success => {
            this.loading = false;
            if (success) {
               this.router.navigate(['/incomes']);
            }
         },
            () => {
               // Show error
               this.loading = false;
            });
   }
}
