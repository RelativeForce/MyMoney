import { Field } from "./field.enum";

export class Heading {
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
      return Heading.formatWithType(this.type, input);
   }

   public static formatWithType(type: Field, input: string): any | null {
      switch (type) {
         case Field.Amount: return Heading.formatAmount(input);
         case Field.Date: return Heading.formatDate(input);
         default: return input;
      }
   }

   private static formatAmount(input: string): number | null {
      const result = /-?[0-9][0-9,\.]+/g.exec(input) as RegExpExecArray | null;

      if (result === null)
         return null;

      return Number.parseFloat(result[0]);
   }

   private static formatDate(input: string): string | null {
      try {
         return new Date(Date.parse(input)).toISOString().split('T')[0];
      } catch (error) {
         return null;
      }
   }
}
