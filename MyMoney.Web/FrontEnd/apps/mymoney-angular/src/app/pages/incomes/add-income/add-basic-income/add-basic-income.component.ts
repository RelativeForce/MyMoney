import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IIncomeModel } from '../../../../shared/state/types';
import { IncomeService } from '../../../../shared/services';
import { minAmountValidator } from '../../../../shared/common-validators';
import { toDateString } from '@mymoney-common/functions';

@Component({
   selector: 'mymoney-add-basic-income',
   templateUrl: './add-basic-income.component.html',
})
export class AddBasicIncomeComponent {
   public addIncomeForm: FormGroup;
   public addIncomeFormControls = {
      date: new FormControl(toDateString(new Date()), [Validators.required]),
      name: new FormControl('', [Validators.required]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      notes: new FormControl(''),
   };
   public loading = false;
   public submitted = false;

   constructor(private readonly router: Router, private readonly incomeService: IncomeService) {
      this.addIncomeForm = new FormGroup(this.addIncomeFormControls);
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.addIncomeForm.invalid) {
         return;
      }

      this.loading = true;

      const date = this.addIncomeFormControls.date.value ?? '';
      const name = this.addIncomeFormControls.name.value ?? '';
      const amount = this.addIncomeFormControls.amount.value ?? 0;
      const notes = this.addIncomeFormControls.notes.value ?? '';

      const income: IIncomeModel = {
         date,
         name,
         amount,
         notes,
         remaining: amount,
         id: 0,
         parentFrequency: null,
         parentId: null,
      };

      this.incomeService.addIncome(income).subscribe(
         (success) => {
            if (success) {
               this.router.navigate(['/incomes']);
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
