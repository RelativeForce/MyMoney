import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../../shared/services';
import { IRecurringTransactionDto, Frequency, ITransactionDto } from '@mymoney/common/api';
import { toInputDateString } from '@mymoney/common/functions';
import { frequencyOptions } from '@mymoney/common';
import { frequencyValidator, minAmountValidator } from '../../../../shared/common-validators';

@Component({
   templateUrl: './edit-recurring-transaction.component.html',
   styleUrls: ['./edit-recurring-transaction.component.scss']
})
export class EditRecurringTransactionComponent implements OnInit {

   public editTransactionForm: FormGroup;
   public editTransactionFormControls = {
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      notes: new FormControl(''),
      recurrence: new FormControl<Frequency>(Frequency.month, [Validators.required, frequencyValidator])
   };
   public id = 0;
   public loading = false;
   public realisingChild: number | null = null;
   public submitted = false;
   public isValid = true;
   public children: { id: number; date: string }[] = [];
   public recurrenceOptions: { key: Frequency; value: string }[] = frequencyOptions;

   constructor(
      private readonly transactionService: TransactionService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
   ) { 
      this.editTransactionForm = new FormGroup(this.editTransactionFormControls);
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/transactions']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.disableForm();

         this.transactionService
            .findRecurringTransaction(this.id)
            .subscribe((response: IRecurringTransactionDto) => {
               this.editTransactionFormControls.start.patchValue(toInputDateString(response.start));
               this.editTransactionFormControls.end.patchValue(toInputDateString(response.end));
               this.editTransactionFormControls.description.patchValue(response.description);
               this.editTransactionFormControls.recurrence.patchValue(response.recurrence);
               this.editTransactionFormControls.amount.patchValue(response.amount);
               this.editTransactionFormControls.notes.patchValue(response.notes);

               this.children = response.children;
               this.enableForm();
            },
               () => this.router.navigate(['/transactions'])
            );
      });
   }

   public onDurationOrRecurrenceChange(): void {
      this.children = [];
      this.isValid = false;
   }

   public addOrEditTransaction(child: { id: number; date: string }) {
      if (child.id < 0) {
         this.realisingChild = child.id;
         this.transactionService
            .realiseTransaction(this.id, child.date, child.id)
            .subscribe((realChild: ITransactionDto) => {
               this.realisingChild = null;
               this.router.navigate(['/transactions', 'edit', realChild.id]);
            });
      } else {
         this.router.navigate(['/transactions', 'edit', child.id]);
      }
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editTransactionForm.invalid) {
         return;
      }

      if (this.editTransactionFormControls.start.dirty || this.editTransactionFormControls.recurrence.dirty) {
         const message = 'Changing the start or recurrence will erase all manual changes to the transaction occurrences.\n\n' + 'Continue?';

         if (!confirm(message)) {
            return;
         }
      }

      this.loading = true;

      this.transactionService
         .editRecurringTransaction(this.asTransactionModel)
         .subscribe(success => {
            this.loading = false;
            if (success) {
               this.router.navigate(['/transactions']);
            }
         },
            () => {
               // Show error
               this.loading = false;
            });
   }

   private disableForm() {
      this.editTransactionFormControls.start.disable();
      this.editTransactionFormControls.end.disable();
      this.editTransactionFormControls.description.disable();
      this.editTransactionFormControls.recurrence.disable();
      this.editTransactionFormControls.amount.disable();
      this.editTransactionFormControls.notes.disable();
   }

   private enableForm() {
      this.editTransactionFormControls.start.enable();
      this.editTransactionFormControls.end.enable();
      this.editTransactionFormControls.description.enable();
      this.editTransactionFormControls.recurrence.enable();
      this.editTransactionFormControls.amount.enable();
      this.editTransactionFormControls.notes.enable();
   }

   private get asTransactionModel(): IRecurringTransactionDto {
      const start: string = new Date(this.editTransactionFormControls.start.value ?? '').toLocaleDateString();
      const end: string = new Date(this.editTransactionFormControls.end.value ?? '').toLocaleDateString();
      const description = this.editTransactionFormControls.description.value ?? '';
      const amount = this.editTransactionFormControls.amount.value ?? 0;
      const notes = this.editTransactionFormControls.notes.value ?? '';
      const recurrence = this.editTransactionFormControls.recurrence.value ?? Frequency.day;

      return {
         start,
         end,
         description,
         amount,
         id: this.id,
         notes,
         recurrence,
         children: []
      };
   }
}
