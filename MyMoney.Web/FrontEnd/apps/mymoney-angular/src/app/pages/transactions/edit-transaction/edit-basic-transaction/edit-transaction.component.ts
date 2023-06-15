import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../../shared/services';
import { ITransactionModel } from '../../../../shared/state/types';
import { Frequency } from '@mymoney-common/api';
import { toFrequencyString } from '@mymoney-common/functions';
import { minAmountValidator } from '../../../../shared/common-validators';

@Component({
   templateUrl: './edit-basic-transaction.component.html',
   styleUrls: ['./edit-basic-transaction.component.scss'],
})
export class EditBasicTransactionComponent implements OnInit {
   public editTransactionForm: FormGroup;
   public editTransactionFormControls = {
      date: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      amount: new FormControl(0.01, [Validators.required, minAmountValidator]),
      notes: new FormControl(''),
   };
   public id: number;
   public parentId: number | null = null;
   public parentFrequency: Frequency | null = null;
   public loading = false;
   public submitted = false;
   public loadingTransaction = true;

   public selectedBudgets: Set<number> = new Set();
   public selectedIncomes: Set<number> = new Set();

   constructor(
      private readonly transactionService: TransactionService,
      private readonly router: Router,
      private readonly activatedRoute: ActivatedRoute
   ) {
      this.id = 0;

      this.editTransactionForm = new FormGroup(
         this.editTransactionFormControls
      );

      this.disableForm();
   }

   public ngOnInit(): void {
      this.activatedRoute.params.subscribe((params) => {
         const idStr = params['id'];

         if (!idStr) {
            this.router.navigate(['/transactions']);
         }

         this.id = Number.parseInt(idStr, 10);

         this.transactionService.findTransaction(this.id).subscribe(
            (response: ITransactionModel) => {
               response.budgetIds.forEach((bid) =>
                  this.selectedBudgets.add(bid)
               );
               response.incomeIds.forEach((iid) =>
                  this.selectedIncomes.add(iid)
               );

               this.editTransactionFormControls.date.patchValue(
                  this.toInputDateString(response.date)
               );
               this.editTransactionFormControls.description.patchValue(
                  response.description
               );
               this.editTransactionFormControls.amount.patchValue(
                  response.amount
               );
               this.editTransactionFormControls.notes.patchValue(
                  response.notes
               );
               this.parentId = response.parentId;
               this.parentFrequency = response.parentFrequency;

               this.enableForm(response.parentId !== null);
               this.loadingTransaction = false;
            },
            () => this.router.navigate(['/transactions'])
         );
      });
   }

   public get selectedDate(): Date | null {
      return this.loadingTransaction
         ? null
         : new Date(this.editTransactionFormControls.date.value ?? '');
   }

   public toInputDateString(text: string): string {
      const month = Number.parseInt(text.split('/')[1], 10);

      const monthStr = month < 10 ? '0' + month : month;

      const day = Number.parseInt(text.split('/')[0], 10);

      const dayStr = day < 10 ? '0' + day : day;

      return text.split('/')[2] + '-' + monthStr + '-' + dayStr;
   }

   public get frequencyString(): string {
      if (this.parentFrequency === null) {
         return '';
      }

      return `(${toFrequencyString(this.parentFrequency)})`;
   }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editTransactionForm.invalid) {
         return;
      }

      this.loading = true;

      this.transactionService
         .editTransaction(this.asTransactionModel)
         .subscribe(
            (success) => {
               this.loading = false;
               if (success) {
                  this.router.navigate(['/transactions']);
               }
            },
            () => {
               // Show error
               this.loading = false;
            }
         );
   }

   private disableForm() {
      this.editTransactionFormControls.date.disable();
      this.editTransactionFormControls.description.disable();
      this.editTransactionFormControls.amount.disable();
      this.editTransactionFormControls.notes.disable();
   }

   private enableForm(isChild: boolean) {
      if (!isChild) {
         this.editTransactionFormControls.date.enable();
         this.editTransactionFormControls.description.enable();
         this.editTransactionFormControls.amount.enable();
      }

      this.editTransactionFormControls.notes.enable();
   }

   private get asTransactionModel(): ITransactionModel {
      const date = new Date(this.editTransactionFormControls.date.value ?? '');

      const dateString: string = date.toLocaleDateString();

      const description =
         this.editTransactionFormControls.description.value ?? '';
      const amount = this.editTransactionFormControls.amount.value ?? 0;
      const notes = this.editTransactionFormControls.notes.value ?? '';

      return {
         date: dateString,
         description,
         amount,
         id: this.id,
         budgetIds: Array.from(this.selectedBudgets),
         incomeIds: Array.from(this.selectedIncomes),
         notes,
         parentId: this.parentId,
         parentFrequency: this.parentFrequency,
      };
   }
}
