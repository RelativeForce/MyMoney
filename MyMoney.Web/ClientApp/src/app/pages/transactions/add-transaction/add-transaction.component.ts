import { Component } from '@angular/core';

@Component({
   templateUrl: './add-transaction.component.html',
   styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent {

   public isRecurring = false;

   constructor() { }

   public onRecurringChanged(checked: boolean): void {
      this.isRecurring = checked;
   }
}
