import { Component } from '@angular/core';

@Component({
   templateUrl: './add-income.component.html',
   styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent {

   public isRecurring = false;

   constructor() { }

   public onRecurringChanged(checked: boolean): void {
      this.isRecurring = checked;
   }
}
