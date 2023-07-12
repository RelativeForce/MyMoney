import { TransactionProperty } from './transaction-property.enum';
import { BaseHeading } from '../../../shared/components/import-file';

export class TransactionHeading extends BaseHeading<TransactionProperty> {
   constructor(property: TransactionProperty) {
      super(property);
   }

   public static transactionPropertyToType(property: TransactionProperty): 'text' | 'date' | 'number' {
      switch (property) {
         case TransactionProperty.amount:
            return 'number';
         case TransactionProperty.date:
            return 'date';
         default:
            return 'text';
      }
   }

   public static formatWithTransactionProperty(type: TransactionProperty, input: string): any | null {
      return BaseHeading.formatWithType(TransactionHeading.transactionPropertyToType(type), input);
   }

   public get isIgnored() {
      return this.property === TransactionProperty.ignore;
   }

   public propertyToType(property: TransactionProperty): 'text' | 'date' | 'number' {
      return TransactionHeading.transactionPropertyToType(property);
   }

   public validate(input: string): string | null {
      switch (this.property) {
         case TransactionProperty.amount: {
            const value: number | null = this.format(input);

            if (value === null) {
               return 'Invalid number format';
            }

            if (value < 0.01) {
               return 'Amount cannot be less than 0.01';
            }

            return null;
         }
         case TransactionProperty.date:
            if (!Date.parse(input)) {
               return 'Invalid date format';
            }

            return null;
         case TransactionProperty.description:
            if (input === '') {
               return 'Description must contain a value';
            }

            return null;
         default:
            return null;
      }
   }
}
