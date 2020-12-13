import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetService, IncomeService, TransactionService } from 'src/app/shared/services';

@Component({
   templateUrl: './import.transactions.component.html'
})
export class ImportTransactionsComponent implements OnInit {

   public importTransactionsForm: FormGroup;
   public rows: string[][];

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly transactionService: TransactionService,
   ) {
      this.rows = [];
   }

   public ngOnInit(): void {
      this.importTransactionsForm = this.formBuilder.group({
         file: [null, Validators.required],
      });
   }

   public get f() { return this.importTransactionsForm.controls; }

   public openFile(event: any) {
      const input = event.target;
      for (var index = 0; index < input.files.length; index++) {
         const reader = new FileReader();
         reader.onload = () => {
            this.rows = [];

            // this 'text' is the content of the file
            const text = reader.result as string;

            const lines: string[] = text.split('\n');

            for (const line of lines) {
               this.rows[this.rows.length] = line.split(',').map(element => element.trim().replace(/"/g, ''));
            }

         }
         reader.readAsText(input.files[index]);
      };
   }

   public deleteRow(rowIndex: number) {
      this.rows.splice(rowIndex, 1);
   }
}
