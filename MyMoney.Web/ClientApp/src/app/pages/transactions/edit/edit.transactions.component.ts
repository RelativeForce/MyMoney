import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetService, TransactionService } from '../../../shared/services';
import { BudgetViewModel } from '../../../shared/classes';
import { ITransactionModel } from 'src/app/shared/state/types';
import { Frequency } from 'src/app/shared/api';
import { toFrequencyString } from 'src/app/shared/functions';
import { IncomeSelectorComponent } from 'src/app/shared/components';

@Component({
   templateUrl: './edit.transactions.component.html',
   styleUrls: ['./edit.transactions.component.scss']
})
export class EditTransactionsComponent implements OnInit {

   @ViewChild(IncomeSelectorComponent)
   public incomeSelector?: IncomeSelectorComponent;

   public editTransactionForm: FormGroup;
   public id: number;
   public parentId: number | null;
   public parentFrequency: Frequency | null;
   public loading = false;
   public submitted = false;

   public selectedBudgets: Set<number> = new Set();
   public budgets: BudgetViewModel[] = [];

   public selectedIncomes: Set<number> = new Set();

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly transactionService: TransactionService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
      private readonly budgetService: BudgetService) {
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/transactions']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.editTransactionForm = this.formBuilder.group({
            date: ['', [Validators.required]],
            description: ['', [Validators.required]],
            amount: [0, [Validators.required, Validators.min(0.01)]],
            notes: ['']
         });

         this.disableForm();

         this.transactionService
            .findTransaction(this.id)
            .subscribe((response: ITransactionModel) => {

               response.budgetIds.forEach(bid => this.selectedBudgets.add(bid));
               response.incomeIds.forEach(iid => this.selectedIncomes.add(iid));

               this.f.date.patchValue(this.toInputDateString(response.date));
               this.f.description.patchValue(response.description);
               this.f.amount.patchValue(response.amount);
               this.f.notes.patchValue(response.notes);
               this.parentId = response.parentId;
               this.parentFrequency = response.parentFrequency;

               this.enableForm(response.parentId !== null);

               this.fetchBudgetsAndIncomes();
            },
               () => this.router.navigate(['/transactions'])
            );
      });
   }

   public get f() {
      return this.editTransactionForm.controls;
   }

   public onBudgetCheckboxChange(event: any, id: number): void {
      if (event.target.checked) {
         this.selectedBudgets.add(id);
      } else {
         this.selectedBudgets.delete(id);
      }
   }

   public onDateChange(): void {

      this.selectedBudgets.clear();
      this.selectedIncomes.clear();

      this.fetchBudgetsAndIncomes();
   }

   public toInputDateString(text: string): string {
      const month = Number.parseInt(text.split('/')[1], 10);

      const monthStr = month < 10 ? '0' + month : month;

      const day = Number.parseInt(text.split('/')[0], 10);

      const dayStr = day < 10 ? '0' + day : day;

      return text.split('/')[2] + '-' + monthStr + '-' + dayStr;
   }

   public get frequencyString(): string {
      if (this.parentFrequency === null) {
         return '';
      }

      return `(${toFrequencyString(this.parentFrequency)})`;
   }

   public fetchBudgetsAndIncomes(): void {
      const date = new Date(this.f.date.value);

      this.budgetService.getBudgetsForMonth(date.getMonth() + 1, date.getFullYear()).subscribe(response => {
         this.budgets = response.budgets.map(t => new BudgetViewModel(t));
      });

      this.incomeSelector?.updateIncomes(date);
   }

   public get month(): string {
      const date = new Date(this.f.date.value);

      return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editTransactionForm.invalid) {
         return;
      }

      this.loading = true;

      this.transactionService
         .editTransaction(this.asTransactionModel)
         .subscribe(success => {
            this.loading = false;
            if (success) {
               this.router.navigate(['/transactions']);
            }
         },
            () => {
               // Show error
               this.loading = false;
            });
   }

   private disableForm() {
      this.f.date.disable();
      this.f.description.disable();
      this.f.amount.disable();
      this.f.notes.disable();
   }

   private enableForm(isChild: boolean) {

      if (!isChild) {
         this.f.date.enable();
         this.f.description.enable();
         this.f.amount.enable();
      }

      this.f.notes.enable();
   }

   private get asTransactionModel(): ITransactionModel {

      const date = new Date(this.f.date.value);

      const dateString: string = date.toLocaleDateString();

      const description = this.f.description.value;
      const amount = this.f.amount.value;
      const notes = this.f.notes.value;

      return {
         date: dateString,
         description,
         amount,
         id: this.id,
         budgetIds: Array.from(this.selectedBudgets),
         incomeIds: Array.from(this.selectedIncomes),
         notes,
         parentId: this.parentId,
         parentFrequency: this.parentFrequency,
      };
   }
}
