import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../../shared/services';
import { IRecurringTransactionDto, Frequency, ITransactionDto } from 'src/app/shared/api';
import { toInputDateString } from 'src/app/shared/functions';
import { frequencyOptions } from 'src/app/shared/constants';
import { frequencyValidator, minAmountValidator } from 'src/app/shared/common-validators';

@Component({
   templateUrl: './edit-recurring-transaction.component.html',
   styleUrls: ['./edit-recurring-transaction.component.scss']
})
export class EditRecurringTransactionComponent implements OnInit {

   public editTransactionForm: FormGroup;
   public id: number;
   public loading = false;
   public realisingChild: number | null = null;
   public submitted = false;
   public isValid = true;
   public children: { id: number; date: string }[] = [];
   public recurrenceOptions: { key: Frequency; value: string }[] = frequencyOptions;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly transactionService: TransactionService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
   ) { }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/transactions']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.editTransactionForm = this.formBuilder.group({
            start: ['', [Validators.required]],
            end: ['', [Validators.required]],
            description: ['', [Validators.required]],
            amount: [0.01, [Validators.required, minAmountValidator]],
            notes: [''],
            recurrence: [Frequency.month, [Validators.required, frequencyValidator]]
         });

         this.disableForm();

         this.transactionService
            .findRecurringTransaction(this.id)
            .subscribe((response: IRecurringTransactionDto) => {
               this.f.start.patchValue(toInputDateString(response.start));
               this.f.end.patchValue(toInputDateString(response.end));
               this.f.description.patchValue(response.description);
               this.f.recurrence.patchValue(response.recurrence);
               this.f.amount.patchValue(response.amount);
               this.f.notes.patchValue(response.notes);

               this.children = response.children;
               this.enableForm();
            },
               () => this.router.navigate(['/transactions'])
            );
      });
   }

   public get f() {
      return this.editTransactionForm.controls;
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

      if (this.f.start.dirty || this.f.recurrence.dirty) {
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
      this.f.start.disable();
      this.f.end.disable();
      this.f.description.disable();
      this.f.recurrence.disable();
      this.f.amount.disable();
      this.f.notes.disable();
   }

   private enableForm() {
      this.f.start.enable();
      this.f.end.enable();
      this.f.description.enable();
      this.f.recurrence.enable();
      this.f.amount.enable();
      this.f.notes.enable();
   }

   private get asTransactionModel(): IRecurringTransactionDto {
      const start: string = new Date(this.f.start.value).toLocaleDateString();
      const end: string = new Date(this.f.end.value).toLocaleDateString();
      const description = this.f.description.value;
      const amount = this.f.amount.value;
      const notes = this.f.notes.value;
      const recurrence = Number.parseInt(this.f.recurrence.value, 10) as Frequency;

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
