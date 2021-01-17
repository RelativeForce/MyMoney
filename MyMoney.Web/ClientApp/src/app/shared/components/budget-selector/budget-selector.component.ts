import { Component, Input } from '@angular/core';
import { BudgetViewModel } from '../../classes';
import { BudgetService } from 'src/app/shared/services';

@Component({
   selector: 'mymoney-budget-selector',
   templateUrl: './budget-selector.component.html',
})
export class BudgetSelectorComponent {
   @Input()
   public selectedBudgets: Set<number> = new Set();

   @Input()
   public date: Date = new Date();

   public budgets: BudgetViewModel[] | null = null;

   constructor(
      private readonly budgetService: BudgetService,
   ) {
   }

   public onBudgetCheckboxChange(event: any, id: number): void {
      if (event.target.checked) {
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
      this.date = date;

      this.budgetService.getBudgetsForMonth(date.getMonth() + 1, date.getFullYear()).subscribe(response => {
         this.budgets = response.budgets.map(t => new BudgetViewModel(t));
      });
   }
}
