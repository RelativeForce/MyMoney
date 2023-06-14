import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../../../shared/services';
import { IRecurringTransactionDto, Frequency } from '@mymoney/common';
import { frequencyOptions } from '@mymoney/common';
import { frequencyValidator, minAmountValidator } from '../../../../shared/common-validators';
import { toDateString } from '@mymoney/common/functions';

@Component({
   selector: 'mymoney-add-recurring-transaction',
   templateUrl: './add-recurring-transaction.component.html',
})
export class AddRecurringTransactionComponent implements OnInit {

   public addTransactionForm: FormGroup;
   public addTransactionFormControls = {
      start: new FormControl(toDateString(new Date()), [Validators.required]),
      end: new FormControl(toDateString(new Date()), [Validators.required]),
      description: new FormControl('', [Validators.required]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      recurrence: new FormControl(Frequency.month, [Validators.required, frequencyValidator]),
      notes: new FormControl('')
   };
   public loading = false;
   public submitted = false;
   public recurrenceOptions: { key: Frequency; value: string }[] = frequencyOptions;

   constructor(
      private readonly router: Router,
      private readonly transactionService: TransactionService,
   ) {
      this.addTransactionForm = new FormGroup(this.addTransactionFormControls);
   }

   public ngOnInit(): void {
      const end = new Date();
      end.setMonth(end.getMonth() + 3);

      this.addTransactionFormControls.end.setValue(toDateString(end));
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.addTransactionForm.invalid) {
         return;
      }

      this.loading = true;

      const start: string = new Date(this.addTransactionFormControls.start.value ?? '').toLocaleDateString();
      const end: string = new Date(this.addTransactionFormControls.end.value ?? '').toLocaleDateString();
      const description = this.addTransactionFormControls.description.value ?? '';
      const amount = this.addTransactionFormControls.amount.value ?? 0;
      const notes = this.addTransactionFormControls.notes.value ?? '';
      const recurrence = this.addTransactionFormControls.recurrence.value ?? Frequency.day;

      const transaction: IRecurringTransactionDto = {
         start,
         end,
         description,
         amount,
         id: 0,
         recurrence,
         notes,
         children: []
      };

      this.transactionService.addRecurringTransaction(transaction).subscribe(success => {
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
