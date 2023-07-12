import { IIncomeDto } from '@mymoney-common/api';
import { IncomeService } from '../../../shared/services';
import { IncomeProperty } from './income-property.enum';
import { BaseHeading, Row, IImportDataProvider } from '../../../shared/components/import-file';
import { IncomeHeading } from './income-heading.class';

const DUPLICATE_INCOME_ERROR = 'Duplicate income: Two incomes with the same name cannot exist on the same day';
const FAILED_IMPORT_ERROR = 'Failed to import income';

export class IncomeImportDataProvider implements IImportDataProvider<IncomeProperty> {
   public fields: IncomeProperty[];
   public homeLink: string;

   constructor(private readonly incomeService: IncomeService) {
      this.fields = Object.values(IncomeProperty);
      this.homeLink = '/incomes';
   }

   public doneMessage(created: number, failed: number): string {
      return `Incomes created: ${created}\n` + `Incomes failed: ${failed}\n\n` + 'Return to incomes page?';
   }

   public markAsDuplicate(rows: Row[]): void {
      rows.forEach((row) => (row.error = DUPLICATE_INCOME_ERROR));
   }

   public markAsUnique(rows: Row[]): void {
      rows.filter((row) => row.error === DUPLICATE_INCOME_ERROR).forEach((row) => (row.error = null));
   }

   public newHeading(): BaseHeading<IncomeProperty> {
      return new IncomeHeading(IncomeProperty.name);
   }

   public setupKeyExtractor(headings: BaseHeading<IncomeProperty>[]): (row: Row) => string {
      const dateIndex = headings.findIndex((h) => h.property === IncomeProperty.date);
      const nameIndex = headings.findIndex((h) => h.property === IncomeProperty.name);

      return (row: Row): string => {
         const date = IncomeHeading.formatWithTransactionProperty(IncomeProperty.date, row.data[dateIndex]);
         const name = IncomeHeading.formatWithTransactionProperty(IncomeProperty.name, row.data[nameIndex]);

         return `${date}${name}`;
      };
   }

   public submit(rows: Row[], headings: BaseHeading<IncomeProperty>[], onComplete: () => void): void {
      const dateIndex = headings.findIndex((h) => h.property === IncomeProperty.date);
      const nameIndex = headings.findIndex((h) => h.property === IncomeProperty.name);
      const amountIndex = headings.findIndex((h) => h.property === IncomeProperty.amount);
      const notesIndex = headings.findIndex((h) => h.property === IncomeProperty.notes);

      function toTransaction(row: Row): { income: IIncomeDto; row: Row } | null {
         const date: string | null = IncomeHeading.formatWithTransactionProperty(IncomeProperty.date, row.data[dateIndex]);
         const amount: number | null = IncomeHeading.formatWithTransactionProperty(IncomeProperty.amount, row.data[amountIndex]);
         const name: string | null = IncomeHeading.formatWithTransactionProperty(IncomeProperty.name, row.data[nameIndex]);
         const notes: string = IncomeHeading.formatWithTransactionProperty(IncomeProperty.notes, row.data[notesIndex]) ?? '';

         if (date === null || amount === null || name === null) {
            return null;
         }

         return {
            income: {
               date: date,
               name,
               amount,
               notes,
               id: 0,
               remaining: amount,
               parentFrequency: null,
               parentId: null,
            },
            row: row,
         };
      }

      const incomeRows = rows
         .map(toTransaction)
         .filter((t) => t !== null)
         .map((t) => t!);

      for (const incomeRow of incomeRows) {
         this.incomeService.addIncome(incomeRow.income).subscribe(
            (success: boolean) => {
               this.setCreated(incomeRow.row, success);
               if (this.isComplete(incomeRows)) {
                  onComplete();
               }
            },
            () => {
               // Error
               this.setCreated(incomeRow.row, false);
               if (this.isComplete(incomeRows)) {
                  onComplete();
               }
            }
         );
      }
   }

   public columnErrorMessage(headings: BaseHeading<IncomeProperty>[]): string | null {
      const amountFieldCount = headings.filter((h) => h.property === IncomeProperty.amount).length;
      const dateFieldCount = headings.filter((h) => h.property === IncomeProperty.date).length;
      const nameFieldCount = headings.filter((h) => h.property === IncomeProperty.name).length;

      if (amountFieldCount === 0) {
         return this.missingFieldErrorMessage(IncomeProperty.amount);
      }

      if (amountFieldCount > 1) {
         return this.multipleFieldErrorMessage(IncomeProperty.amount);
      }

      if (dateFieldCount === 0) {
         return this.missingFieldErrorMessage(IncomeProperty.date);
      }

      if (dateFieldCount > 1) {
         return this.multipleFieldErrorMessage(IncomeProperty.date);
      }

      if (nameFieldCount === 0) {
         return this.missingFieldErrorMessage(IncomeProperty.name);
      }

      if (nameFieldCount > 1) {
         return this.multipleFieldErrorMessage(IncomeProperty.name);
      }

      return null;
   }

   private isComplete(transactionRows: { income: IIncomeDto; row: Row }[]): boolean {
      const remainingCount = transactionRows.filter((tr) => tr.row.success === null).length;
      return remainingCount === 0;
   }

   private missingFieldErrorMessage(field: IncomeProperty): string {
      return `Error:\n'${field}' field is missing, set 1 column as '${field}'`;
   }

   private multipleFieldErrorMessage(field: IncomeProperty): string {
      return `Error:\nError: Multiple '${field}' fields present, please pick one`;
   }

   private setCreated(row: Row, success: boolean): void {
      row.success = success;
      if (!success) {
         row.error = FAILED_IMPORT_ERROR;
      }
   }
}
