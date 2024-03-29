import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ITransactionModel } from '../../../../shared/state/types';
import { TransactionService } from '../../../../shared/services';
import { minAmountValidator } from '../../../../shared/common-validators';
import { toDateString } from '@mymoney-common/functions';

@Component({
   selector: 'mymoney-add-basic-transaction',
   templateUrl: './add-basic-transaction.component.html',
})
export class AddBasicTransactionComponent {
   public addTransactionForm: FormGroup;
   public addTransactionFormControls = {
      date: new FormControl(toDateString(new Date()), [Validators.required]),
      description: new FormControl('', [Validators.required]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      notes: new FormControl(''),
   };
   public loading = false;
   public submitted = false;

   public selectedBudgets: Set<number> = new Set();
   public selectedIncomes: Set<number> = new Set();

   constructor(private readonly router: Router, private readonly transactionService: TransactionService) {
      this.addTransactionForm = new FormGroup(this.addTransactionFormControls);
   }

   public get selectedDate(): Date {
      return new Date(this.addTransactionFormControls.date.value ?? '');
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.addTransactionForm.invalid) {
         return;
      }

      this.loading = true;

      const date = this.addTransactionFormControls.date.value ?? '';
      const description = this.addTransactionFormControls.description.value ?? '';
      const amount = this.addTransactionFormControls.amount.value ?? 0;
      const notes = this.addTransactionFormControls.notes.value ?? '';

      const transaction: ITransactionModel = {
         date,
         description,
         amount,
         id: 0,
         parentId: null,
         parentFrequency: null,
         budgetIds: Array.from(this.selectedBudgets),
         incomeIds: Array.from(this.selectedIncomes),
         notes,
      };

      this.transactionService.addTransaction(transaction).subscribe(
         (success) => {
            if (success) {
               this.router.navigate(['/transactions']);
            }
            this.loading = false;
         },
         () => {
            // Show error
            this.loading = false;
         }
      );
   }
}
