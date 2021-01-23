import { IncomeProperty } from './income-property.enum';
import { BaseHeading } from '../../../shared/components/import';

export class IncomeHeading extends BaseHeading<IncomeProperty> {
   constructor(property: IncomeProperty) {
      super(property);
   }

   public static transactionPropertyToType(property: IncomeProperty): 'text' | 'date' | 'number' {
      switch (property) {
         case IncomeProperty.amount: return 'number';
         case IncomeProperty.date: return 'date';
         default: return 'text';
      }
   }

   public static formatWithTransactionProperty(type: IncomeProperty, input: string): any | null {
      return BaseHeading.formatWithType(IncomeHeading.transactionPropertyToType(type), input);
   }

   public get isIgnored() {
      return this.property === IncomeProperty.ignore;
   }

   public propertyToType(property: IncomeProperty): 'text' | 'date' | 'number' {
      return IncomeHeading.transactionPropertyToType(property);
   }
}
