import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IncomeService } from 'src/app/shared/services';
import { IRecurringIncomeDto, Frequency } from 'src/app/shared/api';
import { frequencyOptions } from 'src/app/shared/constants';

@Component({
   selector: 'mymoney-add-recurring-income',
   templateUrl: './add-recurring-income.component.html',
})
export class AddRecurringIncomeComponent implements OnInit {

   public addIncomeForm: FormGroup;
   public loading = false;
   public submitted = false;
   public recurrenceOptions: { key: Frequency; value: string }[] = frequencyOptions;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly router: Router,
      private readonly incomeService: IncomeService,
   ) { }

   public ngOnInit(): void {

      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 3);

      this.addIncomeForm = this.formBuilder.group({
         start: [start.toISOString().split('T')[0], [Validators.required]],
         end: [end.toISOString().split('T')[0], [Validators.required]],
         name: ['', [Validators.required]],
         amount: [0.01, [Validators.required, Validators.min(0.01)]],
         recurrence: [Frequency.month, [Validators.required, Validators.min(Frequency.day), Validators.max(Frequency.year)]],
         notes: ['']
      });
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

      const start: string = new Date(this.f.start.value).toLocaleDateString();
      const end: string = new Date(this.f.end.value).toLocaleDateString();
      const name = this.f.name.value;
      const amount = this.f.amount.value;
      const notes = this.f.notes.value;
      const recurrence = Number.parseInt(this.f.recurrence.value, 10) as Frequency;

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
