import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetViewModel } from '../../../../shared/classes';
import { ITransactionModel } from 'src/app/shared/state/types';
import { BudgetService, TransactionService } from 'src/app/shared/services';
import { IncomeSelectorComponent } from 'src/app/shared/components';

@Component({
   selector: 'mymoney-add-basic-transaction',
   templateUrl: './add-basic-transaction.component.html',
})
export class AddBasicTransactionComponent implements OnInit, AfterViewInit {

   @ViewChild(IncomeSelectorComponent)
   public incomeSelector?: IncomeSelectorComponent;

   public addTransactionForm: FormGroup;
   public loading = false;
   public submitted = false;

   public selectedBudgets: Set<number> = new Set();
   public budgets: BudgetViewModel[] | null = null;

   public selectedIncomes: Set<number> = new Set();
   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly router: Router,
      private readonly transactionService: TransactionService,
      private readonly budgetService: BudgetService,
   ) {
   }

   public ngAfterViewInit(): void {
      this.onDateChange();
   }

   public ngOnInit(): void {
      this.addTransactionForm = this.formBuilder.group({
         date: [new Date().toISOString().split('T')[0], [Validators.required]],
         description: ['', [Validators.required]],
         amount: [0, [Validators.required, Validators.min(0.01)]],
         notes: ['']
      });
   }

   public get f() {
      return this.addTransactionForm.controls;
   }

   public onBudgetCheckboxChange(event: any, id: number): void {
      if (event.target.checked) {
         this.selectedBudgets.add(id);
      } else {
         this.selectedBudgets.delete(id);
      }
   }

   public get month(): string {
      const date = new Date(this.f.date.value);

      return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
   }

   public onDateChange(): void {

      this.selectedBudgets.clear();
      this.selectedIncomes.clear();

      const date = new Date(this.f.date.value);

      this.budgetService.getBudgetsForMonth(date.getMonth() + 1, date.getFullYear()).subscribe(response => {
         this.budgets = response.budgets.map(t => new BudgetViewModel(t));
      });

      this.incomeSelector?.updateIncomes(date);
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
         parentId: null,
         parentFrequency: null,
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
