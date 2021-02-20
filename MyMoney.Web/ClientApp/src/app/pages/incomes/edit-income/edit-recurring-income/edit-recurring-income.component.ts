import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IncomeService } from '../../../../shared/services';
import { IRecurringIncomeDto, Frequency, IIncomeDto } from 'src/app/shared/api';
import { toInputDateString } from 'src/app/shared/functions';
import { frequencyOptions } from 'src/app/shared/constants';
import { frequencyValidator, minAmountValidator } from 'src/app/shared/common-validators';

@Component({
   templateUrl: './edit-recurring-income.component.html',
   styleUrls: ['./edit-recurring-income.component.scss']
})
export class EditRecurringIncomeComponent implements OnInit {

   public editIncomeForm: FormGroup;
   public id: number;
   public loading = false;
   public realisingChild: number | null = null;
   public submitted = false;
   public isValid = true;
   public children: { id: number; date: string }[] = [];
   public recurrenceOptions: { key: Frequency; value: string }[] = frequencyOptions;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly incomeService: IncomeService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
   ) { }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/incomes']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.editIncomeForm = this.formBuilder.group({
            start: ['', [Validators.required]],
            end: ['', [Validators.required]],
            name: ['', [Validators.required]],
            amount: [0.01, [Validators.required, minAmountValidator]],
            notes: [''],
            recurrence: [Frequency.month, [Validators.required, frequencyValidator]]
         });

         this.disableForm();

         this.incomeService
            .findRecurringIncome(this.id)
            .subscribe((response: IRecurringIncomeDto) => {
               this.f.start.patchValue(toInputDateString(response.start));
               this.f.end.patchValue(toInputDateString(response.end));
               this.f.name.patchValue(response.name);
               this.f.recurrence.patchValue(response.recurrence);
               this.f.amount.patchValue(response.amount);
               this.f.notes.patchValue(response.notes);

               this.children = response.children;
               this.enableForm();
            },
               () => this.router.navigate(['/incomes'])
            );
      });
   }

   public get f() {
      return this.editIncomeForm.controls;
   }

   public onDurationOrRecurrenceChange(): void {
      this.children = [];
      this.isValid = false;
   }

   public addOrEditIncome(child: { id: number; date: string }) {
      if (child.id < 0) {
         this.realisingChild = child.id;
         this.incomeService
            .realiseIncome(this.id, child.date, child.id)
            .subscribe((realChild: IIncomeDto) => {
               this.realisingChild = null;
               this.router.navigate(['/incomes', 'edit', realChild.id]);
            });
      } else {
         this.router.navigate(['/incomes', 'edit', child.id]);
      }
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editIncomeForm.invalid) {
         return;
      }

      if (this.f.start.dirty || this.f.recurrence.dirty) {
         const message = 'Changing the start or recurrence will erase all manual changes to the income occurrences.\n\n' + 'Continue?';

         if (!confirm(message)) {
            return;
         }
      }

      this.loading = true;

      this.incomeService
         .editRecurringIncome(this.asIncomeModel)
         .subscribe(success => {
            this.loading = false;
            if (success) {
               this.router.navigate(['/incomes']);
            }
         },
            () => {
               // Show error
               this.loading = false;
            });
   }

   private disableForm() {
      this.f.start.disable();
      this.f.end.disable();
      this.f.name.disable();
      this.f.recurrence.disable();
      this.f.amount.disable();
      this.f.notes.disable();
   }

   private enableForm() {
      this.f.start.enable();
      this.f.end.enable();
      this.f.name.enable();
      this.f.recurrence.enable();
      this.f.amount.enable();
      this.f.notes.enable();
   }

   private get asIncomeModel(): IRecurringIncomeDto {
      const start: string = new Date(this.f.start.value).toLocaleDateString();
      const end: string = new Date(this.f.end.value).toLocaleDateString();
      const name = this.f.name.value;
      const amount = this.f.amount.value;
      const notes = this.f.notes.value;
      const recurrence = Number.parseInt(this.f.recurrence.value, 10) as Frequency;

      return {
         start,
         end,
         name,
         amount,
         id: this.id,
         notes,
         recurrence,
         children: []
      };
   }
}
