import { ITransactionDto } from '@mymoney-common/api';
import { TransactionService } from '../../../shared/services';
import { TransactionProperty } from './transaction-property.enum';
import {
   BaseHeading,
   Row,
   IImportDataProvider,
} from '../../../shared/components/import-file';
import { TransactionHeading } from './transaction-heading.class';

const DUPLICATE_TRANSACTION_ERROR =
   'Duplicate transaction: Two transactions with the same description cannot exist on the same day';
const FAILED_IMPORT_ERROR = 'Failed to import transaction';

export class TransactionImportDataProvider
   implements IImportDataProvider<TransactionProperty>
{
   public fields: TransactionProperty[];
   public homeLink: string;

   constructor(private readonly transactionService: TransactionService) {
      this.fields = Object.values(TransactionProperty);
      this.homeLink = '/transactions';
   }

   public doneMessage(created: number, failed: number): string {
      return (
         `Transactions created: ${created}\n` +
         `Transactions failed: ${failed}\n\n` +
         'Return to transactions page?'
      );
   }

   public markAsDuplicate(rows: Row[]): void {
      rows.forEach((row) => (row.error = DUPLICATE_TRANSACTION_ERROR));
   }

   public markAsUnique(rows: Row[]): void {
      rows
         .filter((row) => row.error === DUPLICATE_TRANSACTION_ERROR)
         .forEach((row) => (row.error = null));
   }

   public newHeading(): BaseHeading<TransactionProperty> {
      return new TransactionHeading(TransactionProperty.description);
   }

   public setupKeyExtractor(
      headings: BaseHeading<TransactionProperty>[]
   ): (row: Row) => string {
      const dateIndex = headings.findIndex(
         (h) => h.property === TransactionProperty.date
      );
      const descriptionIndex = headings.findIndex(
         (h) => h.property === TransactionProperty.description
      );

      return (row: Row): string => {
         const date = TransactionHeading.formatWithTransactionProperty(
            TransactionProperty.date,
            row.data[dateIndex]
         );
         const description = TransactionHeading.formatWithTransactionProperty(
            TransactionProperty.description,
            row.data[descriptionIndex]
         );

         return `${date}${description}`;
      };
   }

   public submit(
      rows: Row[],
      headings: BaseHeading<TransactionProperty>[],
      onComplete: () => void
   ): void {
      const dateIndex = headings.findIndex(
         (h) => h.property === TransactionProperty.date
      );
      const descriptionIndex = headings.findIndex(
         (h) => h.property === TransactionProperty.description
      );
      const amountIndex = headings.findIndex(
         (h) => h.property === TransactionProperty.amount
      );
      const notesIndex = headings.findIndex(
         (h) => h.property === TransactionProperty.notes
      );

      function toTransaction(
         row: Row
      ): { transaction: ITransactionDto; row: Row } | null {
         const date: string | null =
            TransactionHeading.formatWithTransactionProperty(
               TransactionProperty.date,
               row.data[dateIndex]
            );
         const amount: number | null =
            TransactionHeading.formatWithTransactionProperty(
               TransactionProperty.amount,
               row.data[amountIndex]
            );
         const description: string | null =
            TransactionHeading.formatWithTransactionProperty(
               TransactionProperty.description,
               row.data[descriptionIndex]
            );
         const notes: string | null =
            TransactionHeading.formatWithTransactionProperty(
               TransactionProperty.notes,
               row.data[notesIndex]
            );

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
               notes: notes ?? '',
               parentId: null,
               parentFrequency: null,
            },
            row: row,
         };
      }

      const transactionRows = rows
         .map(toTransaction)
         .filter((t) => t !== null)
         .map((t) => t!);

      for (const transactionRow of transactionRows) {
         this.transactionService
            .addTransaction(transactionRow.transaction)
            .subscribe(
               (success: boolean) => {
                  this.setCreated(transactionRow.row, success);
                  if (this.isComplete(transactionRows)) {
                     onComplete();
                  }
               },
               () => {
                  // Error
                  this.setCreated(transactionRow.row, false);
                  if (this.isComplete(transactionRows)) {
                     onComplete();
                  }
               }
            );
      }
   }

   public columnErrorMessage(
      headings: BaseHeading<TransactionProperty>[]
   ): string | null {
      const amountFieldCount = headings.filter(
         (h) => h.property === TransactionProperty.amount
      ).length;
      const dateFieldCount = headings.filter(
         (h) => h.property === TransactionProperty.date
      ).length;
      const descriptionFieldCount = headings.filter(
         (h) => h.property === TransactionProperty.description
      ).length;
      const notesFieldCount = headings.filter(
         (h) => h.property === TransactionProperty.notes
      ).length;

      if (amountFieldCount === 0) {
         return this.missingFieldErrorMessage(TransactionProperty.amount);
      }

      if (amountFieldCount > 1) {
         return this.multipleFieldErrorMessage(TransactionProperty.amount);
      }

      if (dateFieldCount === 0) {
         return this.missingFieldErrorMessage(TransactionProperty.date);
      }

      if (dateFieldCount > 1) {
         return this.multipleFieldErrorMessage(TransactionProperty.date);
      }

      if (descriptionFieldCount === 0) {
         return this.missingFieldErrorMessage(TransactionProperty.description);
      }

      if (descriptionFieldCount > 1) {
         return this.multipleFieldErrorMessage(TransactionProperty.description);
      }

      if (notesFieldCount > 1) {
         return this.multipleFieldErrorMessage(TransactionProperty.notes);
      }

      return null;
   }

   private isComplete(
      transactionRows: { transaction: ITransactionDto; row: Row }[]
   ): boolean {
      const remainingCount = transactionRows.filter(
         (tr) => tr.row.success === null
      ).length;
      return remainingCount === 0;
   }

   private missingFieldErrorMessage(field: TransactionProperty): string {
      return `Error:\n'${field}' field is missing, set 1 column as '${field}'`;
   }

   private multipleFieldErrorMessage(field: TransactionProperty): string {
      return `Error:\nError: Multiple '${field}' fields present, please pick one`;
   }

   private setCreated(row: Row, success: boolean): void {
      row.success = success;
      if (!success) {
         row.error = FAILED_IMPORT_ERROR;
      }
   }
}
