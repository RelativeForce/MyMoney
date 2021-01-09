import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetViewModel, IncomeViewModel } from '../../../../shared/classes';
import { ITransactionModel } from 'src/app/shared/state/types';
import { BudgetService, IncomeService, TransactionService } from 'src/app/shared/services';

@Component({
   selector: 'mymoney-add-basic-transaction',
   templateUrl: './add-basic.transactions.component.html',
})
export class AddBasicTransactionsComponent implements OnInit {

   public addTransactionForm: FormGroup;
   public loading = false;
   public submitted = false;

   public selectedBudgets: Set<number> = new Set();
   public budgets: BudgetViewModel[] = [];

   public selectedIncomes: Set<number> = new Set();
   public incomes: IncomeViewModel[] = [];

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly router: Router,
      private readonly transactionService: TransactionService,
      private readonly budgetService: BudgetService,
      private readonly incomeService: IncomeService,
   ) {
   }

   public ngOnInit(): void {
      this.addTransactionForm = this.formBuilder.group({
         date: [new Date().toISOString().split('T')[0], [Validators.required]],
         description: ['', [Validators.required]],
         amount: [0, [Validators.required, Validators.min(0)]],
         notes: ['']
      });

      this.onDateChange();
   }

   public get f() {
      return this.addTransactionForm.controls;
   }

   public onBudgetCheckboxChange(e, id): void {
      if (e.target.checked) {
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
      if (this.addTransactionForm.invalid) {
         return;
      }

      this.loading = true;

      const date = this.f.date.value;
      const description = this.f.description.value;
      const amount = this.f.amount.value;
      const notes = this.f.notes.value;

      const transaction: ITransactionModel = {
         date,
         description,
         amount,
         id: 0,
         recurringTransactionId: null,
         recurringPeriod: null,
         budgetIds: Array.from(this.selectedBudgets),
         incomeIds: Array.from(this.selectedIncomes),
         notes
      };

      this.transactionService.addTransaction(transaction).subscribe(success => {
         if (success) {
            this.router.navigate(['/transactions']);
         }
         this.loading = false;
      },
         () => {
            // Show error
            this.loading = false;
         });
   }
}
