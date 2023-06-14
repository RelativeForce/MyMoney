import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IncomeService } from '../../../../shared/services';
import { BudgetViewModel } from '@mymoney/common';
import { IIncomeModel } from '../../../../shared/state/types';
import { toFrequencyString, toInputDateString } from '@mymoney/common/functions';
import { Frequency } from '@mymoney/common';
import { minAmountValidator } from '../../../../shared/common-validators';

@Component({
   templateUrl: './edit-basic-income.component.html',
   styleUrls: ['./edit-basic-income.component.scss']
})
export class EditBasicIncomeComponent implements OnInit {

   public editIncomeForm: FormGroup;
   public editIncomeFormControls = {
      date: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      notes: new FormControl(''),
   };
   public selectedBudgets: Set<number> = new Set();
   public budgets: BudgetViewModel[] = [];
   public id = 0;
   public parentId: number | null = null;
   public parentFrequency: Frequency | null = null;
   public loading = false;
   public submitted = false;
   public loadingIncome = true;

   constructor(
      private readonly incomeService: IncomeService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute
   ) {
      this.editIncomeForm = new FormGroup(this.editIncomeFormControls);
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/incomes']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.disableForm();

         this.incomeService
            .findIncome(this.id)
            .subscribe((response: IIncomeModel) => {

               this.editIncomeFormControls.date.patchValue(toInputDateString(response.date));
               this.editIncomeFormControls.name.patchValue(response.name);
               this.editIncomeFormControls.amount.patchValue(response.amount);
               this.editIncomeFormControls.notes.patchValue(response.notes);
               this.parentId = response.parentId;
               this.parentFrequency = response.parentFrequency;

               this.loadingIncome = false;
               this.enableForm(response.parentId !== null);
            },
               () => {
                  this.router.navigate(['/incomes']);
               });
      });
   }

   public get frequencyString(): string {
      if (this.parentFrequency === null) {
         return '';
      }

      return `(${toFrequencyString(this.parentFrequency)})`;
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

   private disableForm() {
      this.editIncomeFormControls.amount.disable();
      this.editIncomeFormControls.name.disable();
      this.editIncomeFormControls.date.disable();
      this.editIncomeFormControls.notes.disable();
   }

   private enableForm(isChild: boolean) {
      if (!isChild) {
         this.editIncomeFormControls.date.enable();
         this.editIncomeFormControls.name.enable();
         this.editIncomeFormControls.amount.enable();
      }

      this.editIncomeFormControls.notes.enable();
   }

   private get asIncomeModel(): IIncomeModel {

      const date = new Date(this.editIncomeFormControls.date.value ?? '');

      const dateString: string = date.toLocaleDateString();

      const name = this.editIncomeFormControls.name.value ?? '';
      const amount = this.editIncomeFormControls.amount.value ?? 0;
      const notes = this.editIncomeFormControls.notes.value ?? '';

      return {
         date: dateString,
         name,
         amount,
         notes,
         remaining: 0,
         id: this.id,
         parentId: this.parentId,
         parentFrequency: this.parentFrequency,
      };
   }
}
