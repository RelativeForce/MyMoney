import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IncomeViewModel } from '@mymoney/common/classes';

@Component({
   templateUrl: './recurring-income-buttons.component.html',
   selector: 'mymoney-recurring-income-buttons'
})
export class RecurringIncomeButtonsComponent {

   @Input()
   public income!: IncomeViewModel;

   @Output()
   public deleteRecurringIncome: EventEmitter<void> = new EventEmitter<void>();

   public onDeleteRecurringIncomeClicked(): void {
      this.deleteRecurringIncome.emit();
   }
}
