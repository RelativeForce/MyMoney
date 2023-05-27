import { Component } from '@angular/core';

@Component({
   selector: 'mymoney-add-transaction',
   templateUrl: './add-transaction.component.html',
   styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent {

   public isRecurring = false;

   public onRecurringChanged(checked: boolean): void {
      this.isRecurring = checked;
   }
}
