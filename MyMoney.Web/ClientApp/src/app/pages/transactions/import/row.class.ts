export class Row {

   public success: boolean = false;
   public failure: boolean = false;

   constructor(public data: string[], public id: number) {
   }

   public setValue(index: number, value: string) {
      this.data[index] = value;
   }

   public setCreated(success: boolean) {
      this.success = success;
      this.failure = !success;
   }
}
