import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BudgetViewModel } from '@mymoney/common';
import { BudgetService } from '../../../shared/services';

@Component({
   selector: 'mymoney-budget-selector',
   templateUrl: './budget-selector.component.html',
})
export class BudgetSelectorComponent implements OnChanges {
   @Input()
   public selectedBudgets: Set<number> = new Set<number>();

   @Input()
   public date: Date | null = null;

   public budgets: BudgetViewModel[] | null = null;

   constructor(private readonly budgetService: BudgetService) { }

   public ngOnChanges(changes: SimpleChanges): void {
      if (changes['date']) {
         const oldDate: Date | null | undefined = changes['date'].previousValue;
         const newDate: Date | null = changes['date'].currentValue;

         if (newDate === null) {
            return;
         }

         const valueHasChanged = this.date?.getMonth() !== oldDate?.getMonth();
         const isFirstChange = oldDate === undefined || oldDate === null;

         if (valueHasChanged || isFirstChange) {

            if (!isFirstChange) {
               this.selectedBudgets.clear();
            }

            this.updateBudgets(newDate);
         }
      }
   }

   public onBudgetCheckboxChange(newValue: boolean, id: number): void {
      if (newValue) {
         this.selectedBudgets.add(id);
      } else {
         this.selectedBudgets.delete(id);
      }
   }

   public get month(): string {
      if (this.date === null) {
         return '...';
      }

      return `${this.date.toLocaleString('default', { month: 'long' })} ${this.date.getFullYear()}`;
   }

   public updateBudgets(date: Date): void {
      this.budgets = null;
      this.budgetService.getBudgetsForMonth(date.getMonth() + 1, date.getFullYear()).subscribe(response => {
         this.budgets = response.budgets.map(t => new BudgetViewModel(t));
      });
   }
}
