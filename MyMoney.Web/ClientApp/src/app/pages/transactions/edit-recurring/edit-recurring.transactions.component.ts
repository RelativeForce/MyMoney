import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../shared/services';
import { IRecurringTransactionDto, Frequency } from 'src/app/shared/api';
import { periodString } from 'src/app/shared/functions';

@Component({
   templateUrl: './edit-recurring.transactions.component.html'
})
export class EditRecurringTransactionsComponent implements OnInit {

   public editTransactionForm: FormGroup;
   public id: number;
   public loading = false;
   public submitted = false;
   public dateMessage: string | null = null;
   public dates: string[] = [];
   public recurrenceOptions: { key: Frequency; value: string }[];

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly transactionService: TransactionService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute,
   ) {
      this.recurrenceOptions = [
         { key: Frequency.day, value: periodString(Frequency.day) },
         { key: Frequency.week, value: periodString(Frequency.week) },
         { key: Frequency.month, value: periodString(Frequency.month) },
         { key: Frequency.year, value: periodString(Frequency.year) },
      ];
   }

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
            amount: [0, [Validators.required, Validators.min(0)]],
            notes: [''],
            recurrence: [Frequency.month, [Validators.required, Validators.min(Frequency.day), Validators.max(Frequency.year)]]
         });

         this.disableForm();

         this.transactionService
            .findRecurringTransaction(this.id)
            .subscribe((response: IRecurringTransactionDto) => {
               this.f.start.patchValue(this.toInputDateString(response.start));
               this.f.end.patchValue(this.toInputDateString(response.end));
               this.f.description.patchValue(response.description);
               this.f.recurrence.patchValue(response.recurrence);
               this.f.amount.patchValue(response.amount);
               this.f.notes.patchValue(response.notes);

               this.dates = response.dates;
               this.enableForm();
            },
               () => this.router.navigate(['/transactions'])
            );
      });
   }

   public get f() {
      return this.editTransactionForm.controls;
   }

   public get nextDate(): string | null {

      const now = new Date(Date.now()).getTime();

      return this.dates.find(d => Date.parse(this.toInputDateString(d)) > now) ?? null;
   }

   public onDateChange(): void {
      this.dates = [];
      this.dateMessage = 'Dates will be recalculated when saved.';
   }

   public toInputDateString(text: string): string {
      const month = Number.parseInt(text.split('/')[1], 10);

      const monthStr = month < 10 ? '0' + month : month;

      const day = Number.parseInt(text.split('/')[0], 10);

      const dayStr = day < 10 ? '0' + day : day;

      return text.split('/')[2] + '-' + monthStr + '-' + dayStr;
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editTransactionForm.invalid) {
         return;
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
      this.f.amount.disable();
      this.f.notes.disable();
   }

   private enableForm() {
      this.f.start.enable();
      this.f.end.enable();
      this.f.description.enable();
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
         dates: []
      };
   }
}
