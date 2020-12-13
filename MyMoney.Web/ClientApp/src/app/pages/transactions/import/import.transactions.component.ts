import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { BudgetService, IncomeService, TransactionService } from 'src/app/shared/services';

@Component({
   templateUrl: './import.transactions.component.html'
})
export class ImportTransactionsComponent implements OnInit {

   public importTransactionsForm: FormGroup;
   public rows: Row[];
   public headings: Heading[];
   public fields: Field[];

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly transactionService: TransactionService,
   ) {
      this.rows = [];
      this.headings = [];
      this.fields = Object.keys(Field).map(k => Field[k] as Field);
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

            let id = 0;
            for (const line of lines) {

               const data = line.split(',').map(element => element.trim().replace(/"/g, ''));

               this.rows[this.rows.length] = new Row(data, id++);
            }

            this.resetHeadings();
         }
         reader.readAsText(input.files[index]);
      };
   }

   public resetHeadings(): void {
      this.headings = [];

      let columnCount = 0;
      for (const row of this.rows) {
         columnCount = Math.max(columnCount, row.data.length);
      }

      for (let index = 0; index < columnCount; index++) {
         this.headings[index] = new Heading(Field.Description);
      }
   }

   public deleteRow(rowId: number): void {
      this.rows = this.rows.filter(r => r.id !== rowId);
   }

   public changeElementValue(value: string, rowId: number, elementIndex: number) {
      this.rows.find(r => r.id === rowId)?.setValue(elementIndex, value);
   }

   public onColumnChange(value: Field, elementIndex: number) {
      this.headings[elementIndex].type = value;
   }
}

class Row {
   constructor(public data: string[], public id: number) {
   }

   setValue(index: number, value: string) {
      this.data[index] = value;
   }
}

class Heading {
   constructor(public type: Field) { }

   public get inputType() {
      switch (this.type) {
         case Field.Amount: return 'number';
         case Field.Date: return 'date';
         default: return 'text';
      }
   }

   public get isIgnored() {
      return this.type === Field.Ignore;
   }

   public format(input: string): any | null {
      switch (this.type) {
         case Field.Amount: return this.formatAmount(input);
         case Field.Date: return this.formatDate(input);
         default: return input;
      }
   }

   private formatAmount(input: string): any {
      const result = /-?[0-9][0-9,\.]+/g.exec(input) as RegExpExecArray | null;

      if (result === null)
         return null;

      return Number.parseFloat(result[0]);
   }

   private formatDate(input: string): any {
      try {
         return new Date(Date.parse(input)).toISOString().split('T')[0];
      } catch (error) {
         return null;
      }
   }
}

enum Field {
   Description = 'Description',
   Notes = 'Notes',
   Amount = 'Amount',
   Date = 'Date',
   Ignore = 'Ignore'
}