const DUPLICATE_TRANSACTION_ERROR: string = 'Duplicate transaction: Two transactions with the same description cannot exist on the same day';
const FAILED_IMPORT_ERROR: string = 'Failed to upload transaction';

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

   public setCreated(success: boolean) {
      this.success = success;

      if (!success) {
         this.error = FAILED_IMPORT_ERROR;
      }
   }

   public setDuplicateError() {
      this.error = DUPLICATE_TRANSACTION_ERROR;
   }

   public clearDuplicateError() {
      if (this.error !== null && this.error === DUPLICATE_TRANSACTION_ERROR) {
         this.error = null;
      }
   }
}
