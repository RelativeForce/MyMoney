import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetViewModel } from '@mymoney/common/classes';
import { BudgetService } from '../../shared/services';
import { Store } from '@ngrx/store';
import { IAppState } from '../../shared/state/app-state';
import { selectBudgets, selectBudgetsSearchParameters } from '../../shared/state/selectors/budget.selector';
import { monthValidator } from '../../shared/common-validators';

@Component({
   templateUrl: './budgets.component.html',
   styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit {

   public budgets: BudgetViewModel[] = [];
   public monthIdForm: FormGroup;
   public monthIdFormControls = {
      year: new FormControl(0, [Validators.required, Validators.min(1980)]),
      month: new FormControl(0, [Validators.required, monthValidator])
   };
   public loading = false;
   public submitted = false;

   constructor(
      private readonly budgetService: BudgetService,
      private readonly store: Store<IAppState>
   ) {
      this.monthIdForm = new FormGroup(this.monthIdFormControls);
   }

   public ngOnInit(): void {
      this.store
         .select(selectBudgets)
         .subscribe((budgets) => {
            this.budgets = budgets.map(b => new BudgetViewModel(b));
            this.loading = false;
         });

      this.store
         .select(selectBudgetsSearchParameters)
         .subscribe((searchParams) => {
            const month = searchParams.month;
            const year = searchParams.year;

            this.monthIdFormControls.year.setValue(year);
            this.monthIdFormControls.month.setValue(month);
         });

      this.budgetService.refreshBudgets();
   }

   public updateBudgets(): void {
      this.submitted = true;

      if (this.monthIdForm.invalid) {
         return;
      }

      const year = this.monthIdFormControls.year.value as number;
      const month = this.monthIdFormControls.month.value as number;

      this.loading = true;

      this.budgetService.updateMonthId(month, year);
   }

   public deleteBudget(id: number): void {
      if (!confirm(`Delete budget ${id}?`)) {
         return;
      }

      this.budgetService.deleteBudget(id);
   }
}
