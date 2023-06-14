import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IncomeViewModel } from '@mymoney/common';

@Component({
   templateUrl: './basic-income-buttons.component.html',
   selector: 'mymoney-basic-income-buttons'
})
export class BasicIncomeButtonsComponent {

   @Input()
   public income!: IncomeViewModel;

   @Output()
   public deleteIncome: EventEmitter<void> = new EventEmitter<void>();

   public onDeleteIncomeClicked(): void {
      this.deleteIncome.emit();
   }
}
