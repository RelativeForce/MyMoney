import { Component } from '@angular/core';

@Component({
   templateUrl: './add.transactions.component.html',
   styleUrls: ['./add.transactions.component.scss']
})
export class AddTransactionsComponent {

   public isRecurring = false;

   constructor() { }

   public onRecurringChanged(checked: boolean): void {
      this.isRecurring = checked;
   }
}
