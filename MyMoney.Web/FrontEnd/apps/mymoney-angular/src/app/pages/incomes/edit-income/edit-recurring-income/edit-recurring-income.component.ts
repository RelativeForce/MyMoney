import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IncomeService } from '../../../../shared/services';
import { IRecurringIncomeDto, Frequency, IIncomeDto } from '@mymoney/common/api/dtos';
import { toInputDateString } from '@mymoney/common/functions';
import { frequencyOptions } from '@mymoney/common';
import { frequencyValidator, minAmountValidator } from '../../../../shared/common-validators';

@Component({
   templateUrl: './edit-recurring-income.component.html',
   styleUrls: ['./edit-recurring-income.component.scss']
})
export class EditRecurringIncomeComponent implements OnInit {

   public editIncomeForm: FormGroup;
   public editIncomeFormControls = {
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      notes: new FormControl(''),
      recurrence: new FormControl(Frequency.month, [Validators.required, frequencyValidator])
   };
   public id = 0;
   public loading = false;
   public realisingChild: number | null = null;
   public submitted = false;
   public isValid = true;
   public children: { id: number; date: string }[] = [];
   public recurrenceOptions: { key: Frequency; value: string }[] = frequencyOptions;

   constructor(
      private readonly incomeService: IncomeService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
   ) {
      this.editIncomeForm = new FormGroup(this.editIncomeFormControls);
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/incomes']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.disableForm();

         this.incomeService
            .findRecurringIncome(this.id)
            .subscribe((response: IRecurringIncomeDto) => {
               this.editIncomeFormControls.start.patchValue(toInputDateString(response.start));
               this.editIncomeFormControls.end.patchValue(toInputDateString(response.end));
               this.editIncomeFormControls.name.patchValue(response.name);
               this.editIncomeFormControls.recurrence.patchValue(response.recurrence);
               this.editIncomeFormControls.amount.patchValue(response.amount);
               this.editIncomeFormControls.notes.patchValue(response.notes);

               this.children = response.children;
               this.enableForm();
            },
               () => this.router.navigate(['/incomes'])
            );
      });
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

      if (this.editIncomeFormControls.start.dirty || this.editIncomeFormControls.recurrence.dirty) {
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
      this.editIncomeFormControls.start.disable();
      this.editIncomeFormControls.end.disable();
      this.editIncomeFormControls.name.disable();
      this.editIncomeFormControls.recurrence.disable();
      this.editIncomeFormControls.amount.disable();
      this.editIncomeFormControls.notes.disable();
   }

   private enableForm() {
      this.editIncomeFormControls.start.enable();
      this.editIncomeFormControls.end.enable();
      this.editIncomeFormControls.name.enable();
      this.editIncomeFormControls.recurrence.enable();
      this.editIncomeFormControls.amount.enable();
      this.editIncomeFormControls.notes.enable();
   }

   private get asIncomeModel(): IRecurringIncomeDto {
      const start: string = new Date(this.editIncomeFormControls.start.value ?? '').toLocaleDateString();
      const end: string = new Date(this.editIncomeFormControls.end.value ?? '').toLocaleDateString();
      const name = this.editIncomeFormControls.name.value ?? '';
      const amount = this.editIncomeFormControls.amount.value ?? 0;
      const notes = this.editIncomeFormControls.notes.value ?? '';
      const recurrence = this.editIncomeFormControls.recurrence.value ?? Frequency.day;

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
