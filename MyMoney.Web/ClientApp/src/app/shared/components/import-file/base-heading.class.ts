import { toDateString } from "../../functions";

export abstract class BaseHeading<T> {
   constructor(public property: T) { }

   public static formatWithType(type: 'text' | 'date' | 'number', input: string): any | null {
      switch (type) {
         case 'number': return BaseHeading.formatAmount(input);
         case 'date': return BaseHeading.formatDate(input);
         default: return input;
      }
   }

   private static formatAmount(input: string): number | null {
      // If there is more that 1 decimal point
      if (input.split('.').length > 2) {
         return null;
      }

      const result = /-?[0-9]+(\.[0-9]+)?/g.exec(input) as RegExpExecArray | null;
      if (result === null) {
         return null;
      }

      if (result[0].includes('.')) {
         Number.parseFloat(result[0]);
      }

      return Number.parseInt(result[0], 10);
   }

   private static formatDate(input: string): string | null {
      try {
         return toDateString(new Date(Date.parse(input)));
      } catch (error) {
         return null;
      }
   }

   public format(input: string): any | null {
      return BaseHeading.formatWithType(this.propertyToType(this.property), input);
   }

   public abstract get isIgnored(): boolean;
   public abstract propertyToType(property: T): 'text' | 'date' | 'number';
   public abstract validate(input: string): string | null;
   public get inputType(): 'text' | 'date' | 'number' {
      return this.propertyToType(this.property);
   }
}
