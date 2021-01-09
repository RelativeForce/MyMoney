import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ITransactionModel } from 'src/app/shared/state/types';
import { TransactionService } from 'src/app/shared/services';
import { IRecurringTransactionDto, Frequency } from 'src/app/shared/api';
import { toFrequencyString } from 'src/app/shared/functions';

@Component({
   selector: 'mymoney-add-recurring-transaction',
   templateUrl: './add-recurring.transactions.component.html',
})
export class AddRecurringTransactionsComponent implements OnInit {

   public addTransactionForm: FormGroup;
   public loading = false;
   public submitted = false;
   public recurrenceOptions: { key: Frequency; value: string }[];

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly router: Router,
      private readonly transactionService: TransactionService,
   ) {
      this.recurrenceOptions = [
         { key: Frequency.day, value: toFrequencyString(Frequency.day) },
         { key: Frequency.week, value: toFrequencyString(Frequency.week) },
         { key: Frequency.month, value: toFrequencyString(Frequency.month) },
         { key: Frequency.year, value: toFrequencyString(Frequency.year) },
      ];
   }

   public ngOnInit(): void {

      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 3);

      this.addTransactionForm = this.formBuilder.group({
         start: [start.toISOString().split('T')[0], [Validators.required]],
         end: [end.toISOString().split('T')[0], [Validators.required]],
         description: ['', [Validators.required]],
         amount: [0, [Validators.required, Validators.min(0)]],
         recurrence: [Frequency.month, [Validators.required, Validators.min(Frequency.day), Validators.max(Frequency.year)]],
         notes: ['']
      });
   }

   public get f() {
      return this.addTransactionForm.controls;
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.addTransactionForm.invalid) {
         return;
      }

      this.loading = true;

      const start: string = new Date(this.f.start.value).toLocaleDateString();
      const end: string = new Date(this.f.end.value).toLocaleDateString();
      const description = this.f.description.value;
      const amount = this.f.amount.value;
      const notes = this.f.notes.value;
      const recurrence = Number.parseInt(this.f.recurrence.value, 10) as Frequency;

      const transaction: IRecurringTransactionDto = {
         start,
         end,
         description,
         amount,
         id: 0,
         recurrence,
         notes,
         dates: []
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
