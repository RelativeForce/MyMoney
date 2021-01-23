import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IIncomeModel } from 'src/app/shared/state/types';
import { IncomeService } from 'src/app/shared/services';

@Component({
   templateUrl: './add.incomes.component.html'
})
export class AddIncomesComponent implements OnInit {

   public addIncomeForm: FormGroup;
   public loading = false;
   public submitted = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly router: Router,
      private readonly incomeService: IncomeService,
   ) {
   }

   public ngOnInit(): void {
      this.addIncomeForm = this.formBuilder.group({
         date: [new Date().toISOString().split('T')[0], [Validators.required]],
         name: ['', [Validators.required]],
         amount: [0.01, [Validators.required, Validators.min(0.01)]],
         notes: [''],
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

      const date = this.f.date.value;
      const name = this.f.name.value;
      const amount = this.f.amount.value;
      const notes = this.f.notes.value;

      const income: IIncomeModel = {
         date,
         name,
         amount,
         notes,
         remaining: amount,
         id: 0,
      };

      this.incomeService.addIncome(income).subscribe(success => {
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
