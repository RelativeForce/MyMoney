import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetViewModel } from '../../shared/classes';
import { BudgetService } from 'src/app/shared/services';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/shared/state/app-state';
import { selectBudgets, selectBudgetsSearchParameters } from 'src/app/shared/state/selectors/budget.selector';

@Component({
   templateUrl: './budgets.component.html'
})
export class BudgetsComponent implements OnInit {

   public budgets: BudgetViewModel[] = [];
   public monthIdForm: FormGroup;
   public loading: Boolean = false;
   public submitted: Boolean = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly budgetService: BudgetService,
      private readonly store: Store<IAppState>
   ) { }

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

            this.monthIdForm = this.formBuilder.group({
               year: [year, [Validators.required, Validators.min(1980)]],
               month: [month, [Validators.required, Validators.min(1), Validators.max(12)]]
            });
         });

      this.budgetService.refreshBudgets();
   }

   public updateBudgets(): void {
      this.submitted = true;

      if (this.monthIdForm.invalid) {
         return;
      }

      const year = this.f.year.value as number;
      const month = this.f.month.value as number;

      this.loading = true;

      this.budgetService.updateMonthId(month, year);
   }

   public get f() {
      return this.monthIdForm.controls;
   }

   public delete(id: number): void {
      if (!confirm(`Delete budget ${id}?`)) {
         return;
      }

      this.budgetService.deleteBudget(id);
   }
}
