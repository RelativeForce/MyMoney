import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ITransactionDto } from 'src/app/shared/api';
import { TransactionService } from 'src/app/shared/services';
import { Field } from './field.enum';
import { Heading } from './heading.class';
import { Row } from './row.class';
import { groupBy } from '../../../shared/functions';

@Component({
   templateUrl: './import.transactions.component.html'
})
export class ImportTransactionsComponent {

   public rows: Row[];
   public headings: Heading[];
   public fields: Field[];
   public isLoading: boolean;
   public isDone: boolean;

   constructor(private readonly transactionService: TransactionService, private readonly router: Router) {
      this.rows = [];
      this.headings = [];
      this.isLoading = false;
      this.isDone = false;
      this.fields = Object.keys(Field).map(k => Field[k] as Field);
   }

   public openFile(event: any) {
      const input = event.target;
      for (var index = 0; index < input.files.length; index++) {
         const reader = new FileReader();
         reader.onload = () => {
            this.rows = [];

            // this 'text' is the content of the file
            const text = reader.result as string;

            const lines: string[] = text.split('\n');

            let id = 0;
            for (const line of lines) {

               const data = line.split(',').map(element => element.trim().replace(/"/g, ''));

               this.rows[this.rows.length] = new Row(data, id++);
            }

            this.resetHeadings();
            this.checkRows();
         }
         reader.readAsText(input.files[index]);
      };
   }

   public resetHeadings(): void {
      this.headings = [];
      this.isLoading = false;
      this.isDone = false;

      let columnCount = 0;
      for (const row of this.rows) {
         columnCount = Math.max(columnCount, row.data.length);
      }

      for (let index = 0; index < columnCount; index++) {
         this.headings[index] = new Heading(Field.Description);
      }

      for (const row of this.rows) {
         if (row.data.length === columnCount) continue;

         for (let index = 0; index < columnCount; index++) {

            if (row.data[index] === undefined) {
               row.data[index] = '';
            }
         }
      }
   }

   public deleteRow(rowId: number): void {
      this.rows = this.rows.filter(r => r.id !== rowId);

      this.checkRows();
   }

   public changeElementValue(value: string, rowId: number, elementIndex: number) {
      this.rows.find(r => r.id === rowId)?.setValue(elementIndex, value);

      this.checkRows();
   }

   public onColumnChange(value: Field, elementIndex: number) {
      this.headings[elementIndex].type = value;

      this.checkRows();
   }

   public checkRows() {

      if (this.columnErrorMessage() !== null)
         return; // Skip if the columns are not valid

      const dateIndex = this.headings.findIndex(h => h.type === Field.Date);
      const descriptionIndex = this.headings.findIndex(h => h.type === Field.Description);

      const duplicateTransactions = groupBy(this.rows,
         (row: Row) => `${Heading.formatWithType(Field.Date, row.data[dateIndex])}${Heading.formatWithType(Field.Description, row.data[descriptionIndex])}`)
         .entries();

      for (const [_, rows] of duplicateTransactions) {

         if (rows.length === 1) {
            // Clear the error
            rows.forEach(row => row.clearDuplicateError());
            continue;
         }

         rows.forEach(row => row.setDuplicateError());
      }
   }

   public alert(text: string): void {
      alert(text);
   }

   public onSubmit(): void {

      const columnErrorMessage = this.columnErrorMessage();

      if (columnErrorMessage !== null) {
         return alert(columnErrorMessage);
      }

      const anyInvalidRows: boolean = this.rows
         .map(r => this.isRowValid(r))
         .reduce((a, b) => a || b, false);

      if (anyInvalidRows) {
         if (!confirm('Warning:\nSome rows have invalid data, these rows will be ignored.\nContinue?'))
            return;
      }

      this.isLoading = true;

      const dateIndex = this.headings.findIndex(h => h.type === Field.Date);
      const descriptionIndex = this.headings.findIndex(h => h.type === Field.Description);
      const amountIndex = this.headings.findIndex(h => h.type === Field.Amount);
      const notesIndex = this.headings.findIndex(h => h.type === Field.Notes);

      function toTransaction(row: Row): { transaction: ITransactionDto, row: Row } | null {

         const date: string | null = Heading.formatWithType(Field.Date, row.data[dateIndex]);
         const amount: number | null = Heading.formatWithType(Field.Amount, row.data[amountIndex]);
         const description: string | null = Heading.formatWithType(Field.Description, row.data[descriptionIndex]);
         const notes: string | null = Heading.formatWithType(Field.Notes, row.data[notesIndex]);

         if (date === null || amount === null || description === null) {
            return null;
         }

         return {
            transaction: {
               date: date,
               description,
               amount,
               id: 0,
               budgetIds: [],
               incomeIds: [],
               notes: notes ?? ''
            },
            row: row
         };
      }

      const transactionRows = this.rows.map(toTransaction).filter(t => t !== null);

      for (const transactionRow of transactionRows) {
         this.transactionService.addTransaction(transactionRow.transaction).subscribe((success: boolean) => {
            // Success
            transactionRow.row.setCreated(success);
            this.checkIsDone(transactionRows);
         }, () => {
            // Error
            transactionRow.row.setCreated(false);
            this.checkIsDone(transactionRows);
         });
      }
   }

   private checkIsDone(transactionRows: { transaction: ITransactionDto, row: Row }[]) {

      const remainingCount = transactionRows.filter(tr => tr.row.success === null).length;

      this.isDone = remainingCount === 0;

      if (this.isDone) {
         this.isLoading = false;

         setTimeout(() => {
            if (this.doneConfirmation()) {
               this.router.navigate(['/transactions']);
            }
         }, 1000)
      }
   }

   private columnErrorMessage(): string | null {
      const amountFieldCount = this.headings.filter(h => h.type === Field.Amount).length;
      const dateFieldCount = this.headings.filter(h => h.type === Field.Date).length;
      const descriptionFieldCount = this.headings.filter(h => h.type === Field.Description).length;
      const notesFieldCount = this.headings.filter(h => h.type === Field.Notes).length;

      if (amountFieldCount === 0)
         return this.missingFieldErrorMessage(Field.Amount);

      if (amountFieldCount > 1)
         return this.multipleFieldErrorMessage(Field.Amount);

      if (dateFieldCount === 0)
         return this.missingFieldErrorMessage(Field.Date);

      if (dateFieldCount > 1)
         return this.multipleFieldErrorMessage(Field.Date);

      if (descriptionFieldCount === 0)
         return this.missingFieldErrorMessage(Field.Description);

      if (descriptionFieldCount > 1)
         return this.multipleFieldErrorMessage(Field.Description);

      if (notesFieldCount > 1)
         return this.multipleFieldErrorMessage(Field.Notes);

      return null;
   }

   private isRowValid(row: Row) {

      const allDataValid = row.data
         .map((d, index) => this.headings[index].format(d) === null)
         .reduce((a, b) => a || b, false);

      return allDataValid;
   }

   private missingFieldErrorMessage(field: Field): string {
      return (`Error:\n'${field}' field is missing, set on column as '${field}'`);
   }

   private multipleFieldErrorMessage(field: Field): string {
      return (`Error:\nError: Multiple '${field}' fields present, please pick one`);
   }

   private doneConfirmation(): boolean {
      return confirm(
         `Transactions created: ${this.rows.filter(r => r.success === true).length}\n` +
         `Transactions failed: ${this.rows.filter(r => r.success === false).length}\n\n` +
         'Return to transactions page?'
      );
   }
}
