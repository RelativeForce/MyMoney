import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetService, IncomeService, TransactionService } from '../../../shared/services';
import { BudgetViewModel, IncomeViewModel } from '../../../shared/classes';
import { ITransactionModel } from 'src/app/shared/state/types';

@Component({
   templateUrl: './edit.transactions.component.html'
})
export class EditTransactionsComponent implements OnInit {

   public editTransactionForm: FormGroup;
   public id: number;
   public loading = false;
   public submitted = false;

   public selectedBudgets: Set<number> = new Set();
   public budgets: BudgetViewModel[] = [];

   public selectedIncomes: Set<number> = new Set();
   public incomes: IncomeViewModel[] = [];


   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly transactionService: TransactionService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
      private readonly budgetService: BudgetService,
      private readonly incomeService: IncomeService
   ) {
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
            amount: [0, [Validators.required, Validators.min(0)]],
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

               this.enableForm();

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

   public onIncomeCheckboxChange(e, id): void {
      if (e.target.checked) {
         this.selectedIncomes.add(id);
      } else {
         this.selectedIncomes.delete(id);
      }
   }

   public onDateChange(): void {

      this.selectedBudgets.clear();

      this.fetchBudgetsAndIncomes();
   }

   public toInputDateString(text: string): string {
      const month = Number.parseInt(text.split('/')[1], 10);

      const monthStr = month < 10 ? '0' + month : month;

      const day = Number.parseInt(text.split('/')[0], 10);

      const dayStr = day < 10 ? '0' + day : day;

      return text.split('/')[2] + '-' + monthStr + '-' + dayStr;
   }

   public fetchBudgetsAndIncomes(): void {
      const date = new Date(this.f.date.value);

      this.budgetService.getBudgetsForMonth(date.getMonth() + 1, date.getFullYear()).subscribe(response => {
         this.budgets = response.budgets.map(t => new BudgetViewModel(t));
      });

      this.incomeService.getIncomesByDate(date).subscribe(response => {
         this.incomes = response.incomes.map(t => new IncomeViewModel(t));
      });
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

   private enableForm() {
      this.f.date.enable();
      this.f.description.enable();
      this.f.amount.enable();
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
         recurringTransactionId: null,
      };
   }
}
