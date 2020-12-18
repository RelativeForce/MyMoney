import { TransactionProperty } from "./transaction-property.enum";
import { BaseHeading } from '../../../shared/components/import';

export class TransactionHeading extends BaseHeading<TransactionProperty> {
   constructor(property: TransactionProperty) {
      super(property);
   }

   public get isIgnored() {
      return this.property === TransactionProperty.Ignore;
   }

   public propertyToType(property: TransactionProperty): 'text' | 'date' | 'number' {
      return TransactionHeading.transactionPropertyToType(property);
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
}
