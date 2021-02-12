import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IncomeService } from '../../../../shared/services';
import { BudgetViewModel } from '../../../../shared/classes';
import { IIncomeModel } from 'src/app/shared/state/types';
import { toFrequencyString, toInputDateString } from 'src/app/shared/functions';
import { Frequency } from 'src/app/shared/api';

@Component({
   templateUrl: './edit-basic-income.component.html',
   styleUrls: ['./edit-basic-income.component.scss']
})
export class EditBasicIncomeComponent implements OnInit {

   public editIncomeForm: FormGroup;
   public selectedBudgets: Set<number> = new Set();
   public budgets: BudgetViewModel[] = [];
   public id: number;
   public parentId: number | null = null;
   public parentFrequency: Frequency | null = null;
   public loading = false;
   public submitted = false;
   public loadingIncome = true;

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
            date: ['', [Validators.required]],
            name: ['', [Validators.required]],
            amount: [0.01, [Validators.required, Validators.min(0.01)]],
            notes: [''],
         });

         this.disableForm();

         this.incomeService
            .findIncome(this.id)
            .subscribe((response: IIncomeModel) => {

               this.f.date.patchValue(toInputDateString(response.date));
               this.f.name.patchValue(response.name);
               this.f.amount.patchValue(response.amount);
               this.f.notes.patchValue(response.notes);
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


   public get f() {
      return this.editIncomeForm.controls;
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
      this.f.amount.disable();
      this.f.name.disable();
      this.f.date.disable();
      this.f.notes.disable();
   }

   private enableForm(isChild: boolean) {
      if (!isChild) {
         this.f.date.enable();
         this.f.name.enable();
         this.f.amount.enable();
      }

      this.f.notes.enable();
   }

   private get asIncomeModel(): IIncomeModel {

      const date = new Date(this.f.date.value);

      const dateString: string = date.toLocaleDateString();

      const name = this.f.name.value;
      const amount = this.f.amount.value;
      const notes = this.f.notes.value;

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
