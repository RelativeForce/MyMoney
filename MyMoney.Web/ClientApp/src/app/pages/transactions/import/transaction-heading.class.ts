import { TransactionProperty } from './transaction-property.enum';
import { BaseHeading } from '../../../shared/components/import';

export class TransactionHeading extends BaseHeading<TransactionProperty> {
   constructor(property: TransactionProperty) {
      super(property);
   }

   public static transactionPropertyToType(property: TransactionProperty): 'text' | 'date' | 'number' {
      switch (property) {
         case TransactionProperty.Amount: return 'number';
         case TransactionProperty.Date: return 'date';
         default: return 'text';
      }
   }

   public static formatWithTransactionProperty(type: TransactionProperty, input: string): any | null {
      return BaseHeading.formatWithType(TransactionHeading.transactionPropertyToType(type), input);
   }

   public get isIgnored() {
      return this.property === TransactionProperty.Ignore;
   }

   public propertyToType(property: TransactionProperty): 'text' | 'date' | 'number' {
      return TransactionHeading.transactionPropertyToType(property);
   }

   public validate(input: string): string | null {
      switch (this.property) {
         case TransactionProperty.Amount:
            const value: number | null = this.format(input);
            if (value === null) {
               return 'Invalid number format';
            }

            if (value < 0.01) {
               return 'Amount cannot be less than 0.01';
            }

            return null;
         case TransactionProperty.Date:
            if (!Date.parse(input)) {
               return 'Invalid date format';
            }

            return null;
         case TransactionProperty.Description:
            if (input === '') {
               return 'Description must contain a value';
            }

            return null;
         default: return null;
      }
   }
}
