import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IncomeService } from 'src/app/shared/services';
import { IRecurringIncomeDto, Frequency } from 'src/app/shared/api';
import { frequencyOptions } from 'src/app/shared/constants';
import { frequencyValidator, minAmountValidator } from 'src/app/shared/common-validators';

@Component({
   selector: 'mymoney-add-recurring-income',
   templateUrl: './add-recurring-income.component.html',
})
export class AddRecurringIncomeComponent implements OnInit {

   public addIncomeForm: FormGroup;
   public addIncomeFormControls = {
      start: new FormControl(new Date().toISOString().split('T')[0], [Validators.required]),
      end: new FormControl(new Date().toISOString().split('T')[0], [Validators.required]),
      name: new FormControl('', [Validators.required]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      recurrence: new FormControl(Frequency.month, [Validators.required, frequencyValidator]),
      notes: new FormControl(''),
   };
   public loading = false;
   public submitted = false;
   public recurrenceOptions: { key: Frequency; value: string }[] = frequencyOptions;

   constructor(
      private readonly router: Router,
      private readonly incomeService: IncomeService,
   ) { 
      this.addIncomeForm = new FormGroup(this.addIncomeFormControls);
   }

   public ngOnInit(): void {
      const end = new Date();
      end.setMonth(end.getMonth() + 3);

      this.addIncomeFormControls.end.setValue(end.toISOString().split('T')[0]);
   }

   public get f() {
      return this.addIncomeForm.controls;
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.addIncomeForm.invalid) {
         return;
      }

      this.loading = true;

      const start: string = new Date(this.addIncomeFormControls.start.value ?? '').toLocaleDateString();
      const end: string = new Date(this.addIncomeFormControls.end.value ?? '').toLocaleDateString();
      const name = this.addIncomeFormControls.name.value ?? '';
      const amount = this.addIncomeFormControls.amount.value ?? 0;
      const notes = this.addIncomeFormControls.notes.value ?? '';
      const recurrence = this.addIncomeFormControls.recurrence.value ?? Frequency.day;

      const income: IRecurringIncomeDto = {
         start,
         end,
         name,
         amount,
         id: 0,
         recurrence,
         notes,
         children: []
      };

      this.incomeService.addRecurringIncome(income).subscribe(success => {
         if (success) {
            this.router.navigate(['/incomes']);
         }
         this.loading = false;
      },
         () => {
            // Show error
            this.loading = false;
         });
   }
}
