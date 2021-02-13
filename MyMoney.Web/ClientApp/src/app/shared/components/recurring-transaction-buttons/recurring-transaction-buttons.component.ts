import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionViewModel } from '../../classes';

@Component({
   templateUrl: './recurring-transaction-buttons.component.html',
   selector: 'mymoney-recurring-transaction-buttons'
})
export class RecurringTransactionButtonsComponent {

   @Input()
   public transaction!: TransactionViewModel;

   @Output()
   public deleteRecurringTransaction: EventEmitter<void> = new EventEmitter<void>();

   public onDeleteRecurringTransactionClicked(): void {
      this.deleteRecurringTransaction.emit();
   }
}
