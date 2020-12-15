import { IIncomeDto } from 'src/app/shared/api';
import { IncomeService } from 'src/app/shared/services';
import { IncomeProperty } from './income-property.enum';
import { BaseHeading, Row, IImportDataProvider } from '../../../shared/components/import';
import { IncomeHeading } from "./income-heading.class";

const DUPLICATE_INCOME_ERROR: string = 'Duplicate income: Two incomes with the same name cannot exist on the same day';
const FAILED_IMPORT_ERROR: string = 'Failed to import income';

export class IncomeImportDataProvider implements IImportDataProvider<IncomeProperty> {

   public fields: IncomeProperty[];
   public homeLink: string;

   constructor(private readonly incomeService: IncomeService) {
      this.fields = Object.keys(IncomeProperty).map(k => IncomeProperty[k] as IncomeProperty);
      this.homeLink = '/incomes';
   }

   public doneMessage(created: number, failed: number): string {
      return (
         `Incomes created: ${created}\n` +
         `Incomes failed: ${failed}\n\n` +
         'Return to incomes page?'
      )
   }

   public markAsDuplicate(rows: Row[]): void {
      rows.forEach(row => row.error = DUPLICATE_INCOME_ERROR);
   }

   public markAsUnique(rows: Row[]): void {
      rows.filter(row => row.error === DUPLICATE_INCOME_ERROR).forEach(row => row.error = null);
   }

   public newHeading(): BaseHeading<IncomeProperty> {
      return new IncomeHeading(IncomeProperty.Name);
   }

   public setupKeyExtractor(headings: BaseHeading<IncomeProperty>[]): ((row: Row) => string) {
      const dateIndex = headings.findIndex(h => h.property === IncomeProperty.Date);
      const nameIndex = headings.findIndex(h => h.property === IncomeProperty.Name);

      return (row: Row): string => {
         const date = IncomeHeading.formatWithTransactionProperty(IncomeProperty.Date, row.data[dateIndex]);
         const name = IncomeHeading.formatWithTransactionProperty(IncomeProperty.Name, row.data[nameIndex]);

         return `${date}${name}`;
      };
   }

   public submit(rows: Row[], headings: BaseHeading<IncomeProperty>[], onComplete: () => void): void {
      const dateIndex = headings.findIndex(h => h.property === IncomeProperty.Date);
      const nameIndex = headings.findIndex(h => h.property === IncomeProperty.Name);
      const amountIndex = headings.findIndex(h => h.property === IncomeProperty.Amount);

      function toTransaction(row: Row): { income: IIncomeDto; row: Row; } | null {

         const date: string | null = IncomeHeading.formatWithTransactionProperty(IncomeProperty.Date, row.data[dateIndex]);
         const amount: number | null = IncomeHeading.formatWithTransactionProperty(IncomeProperty.Amount, row.data[amountIndex]);
         const name: string | null = IncomeHeading.formatWithTransactionProperty(IncomeProperty.Name, row.data[nameIndex]);

         if (date === null || amount === null || name === null) {
            return null;
         }

         return {
            income: {
               date: date,
               name,
               amount,
               id: 0,
               remaining: amount
            },
            row: row
         };
      }

      const incomeRows = rows.map(toTransaction).filter(t => t !== null);

      for (const incomeRow of incomeRows) {
         this.incomeService.addIncome(incomeRow.income).subscribe((success: boolean) => {
            this.setCreated(incomeRow.row, success);
            if (this.isComplete(incomeRows)) {
               onComplete();
            }
         }, () => {
            // Error
            this.setCreated(incomeRow.row, false);
            if (this.isComplete(incomeRows)) {
               onComplete();
            }
         });
      }
   }

   public columnErrorMessage(headings: BaseHeading<IncomeProperty>[]): string | null {

      const amountFieldCount = headings.filter(h => h.property === IncomeProperty.Amount).length;
      const dateFieldCount = headings.filter(h => h.property === IncomeProperty.Date).length;
      const nameFieldCount = headings.filter(h => h.property === IncomeProperty.Name).length;

      if (amountFieldCount === 0)
         return this.missingFieldErrorMessage(IncomeProperty.Amount);

      if (amountFieldCount > 1)
         return this.multipleFieldErrorMessage(IncomeProperty.Amount);

      if (dateFieldCount === 0)
         return this.missingFieldErrorMessage(IncomeProperty.Date);

      if (dateFieldCount > 1)
         return this.multipleFieldErrorMessage(IncomeProperty.Date);

      if (nameFieldCount === 0)
         return this.missingFieldErrorMessage(IncomeProperty.Name);

      if (nameFieldCount > 1)
         return this.multipleFieldErrorMessage(IncomeProperty.Name);

      return null;
   }

   private isComplete(transactionRows: { income: IIncomeDto; row: Row; }[]): boolean {
      const remainingCount = transactionRows.filter(tr => tr.row.success === null).length;
      return remainingCount === 0;
   }

   private missingFieldErrorMessage(field: IncomeProperty): string {
      return (`Error:\n'${field}' field is missing, set on column as '${field}'`);
   }

   private multipleFieldErrorMessage(field: IncomeProperty): string {
      return (`Error:\nError: Multiple '${field}' fields present, please pick one`);
   }

   private setCreated(row: Row, success: boolean): void {
      row.success = success;
      if (!success) {
         row.error = FAILED_IMPORT_ERROR;
      }
   }
}
