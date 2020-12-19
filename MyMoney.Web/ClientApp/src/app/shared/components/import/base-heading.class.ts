export abstract class BaseHeading<T> {
   constructor(public property: T) { }

   public abstract get isIgnored(): boolean;
   public abstract propertyToType(property: T): 'text' | 'date' | 'number';

   public format(input: string): any | null {
      return BaseHeading.formatWithType(this.propertyToType(this.property), input);
   }

   public get inputType(): 'text' | 'date' | 'number' {
      return this.propertyToType(this.property);
   }

   public static formatWithType(type: 'text' | 'date' | 'number', input: string): any | null {
      switch (type) {
         case 'number': return BaseHeading.formatAmount(input);
         case 'date': return BaseHeading.formatDate(input);
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