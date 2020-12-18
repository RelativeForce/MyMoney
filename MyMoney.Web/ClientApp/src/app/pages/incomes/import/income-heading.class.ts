import { IncomeProperty } from "./income-property.enum";
import { BaseHeading } from '../../../shared/components/import';

export class IncomeHeading extends BaseHeading<IncomeProperty> {
   constructor(property: IncomeProperty) {
      super(property);
   }

   public get isIgnored() {
      return this.property === IncomeProperty.Ignore;
   }

   public propertyToType(property: IncomeProperty): 'text' | 'date' | 'number' {
      return IncomeHeading.transactionPropertyToType(property);
   }

   public static transactionPropertyToType(property: IncomeProperty): 'text' | 'date' | 'number' {
      switch (property) {
         case IncomeProperty.Amount: return 'number';
         case IncomeProperty.Date: return 'date';
         default: return 'text';
      }
   }

   public static formatWithTransactionProperty(type: IncomeProperty, input: string): any | null {
      return BaseHeading.formatWithType(IncomeHeading.transactionPropertyToType(type), input);
   }
}
