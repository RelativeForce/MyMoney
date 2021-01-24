import { IncomeProperty } from './income-property.enum';
import { BaseHeading } from '../../../shared/components/import-file';

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

   public validate(input: string): string | null {
      switch (this.property) {
         case IncomeProperty.amount:
            const value: number | null = this.format(input);
            if (value === null) {
               return 'Invalid number format';
            }

            if (value < 0.01) {
               return 'Amount cannot be less than 0.01';
            }

            return null;
         case IncomeProperty.date:
            if (!Date.parse(input)) {
               return 'Invalid date format';
            }

            return null;
         case IncomeProperty.name:
            if (input === '') {
               return 'Name must contain a value';
            }

            return null;
         default: return null;
      }
   }
}
