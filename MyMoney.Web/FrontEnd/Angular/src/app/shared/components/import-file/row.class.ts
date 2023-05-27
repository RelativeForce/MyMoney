export class Row {

   public success: boolean | null;
   public error: string | null;

   constructor(public data: string[], public id: number) {
      this.success = null;
      this.error = null;
   }

   public setValue(index: number, value: string) {
      this.data[index] = value;
   }
}
