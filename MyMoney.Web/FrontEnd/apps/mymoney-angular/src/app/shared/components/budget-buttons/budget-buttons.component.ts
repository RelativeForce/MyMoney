import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BudgetViewModel } from '@mymoney-common/classes';

@Component({
   templateUrl: './budget-buttons.component.html',
   selector: 'mymoney-budget-buttons',
})
export class BudgetButtonsComponent {
   @Input()
   public budget!: BudgetViewModel;

   @Output()
   public deleteBudget: EventEmitter<void> = new EventEmitter<void>();

   public onDeleteBudgetClicked(): void {
      this.deleteBudget.emit();
   }
}
