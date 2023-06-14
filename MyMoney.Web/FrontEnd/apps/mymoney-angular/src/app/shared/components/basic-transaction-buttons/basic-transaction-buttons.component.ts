import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionViewModel } from '@mymoney/common';

@Component({
   templateUrl: './basic-transaction-buttons.component.html',
   selector: 'mymoney-basic-transaction-buttons'
})
export class BasicTransactionButtonsComponent {

   @Input()
   public transaction!: TransactionViewModel;

   @Output()
   public deleteTransaction: EventEmitter<void> = new EventEmitter<void>();

   public onDeleteTransactionClicked(): void {
      this.deleteTransaction.emit();
   }
}
