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
         .subscribe((transactions) => {
            this.budgets = transactions.map(b => new BudgetViewModel(b));
            this.loading = false;
         });

      this.store
         .select(selectBudgetsSearchParameters)
         .subscribe((searchParams) => {
            const month = searchParams.month;
            const year = searchParams.year;

            this.monthIdForm = this.formBuilder.group({
               year: [year, Validators.required],
               month: [month, Validators.required]
            });
         });
   }

   public get f() { return this.monthIdForm.controls; }

   public delete(id: number): void {

      this.budgetService.deleteBudget(id);
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.monthIdForm.invalid || this.f.year.value < 0 || this.f.month.value < 0 || this.f.month.value > 12) {
         return;
      }

      const year = this.f.year.value as number;
      const month = this.f.month.value as number;

      this.loading = true;

      this.budgetService.updateMonthId(month, year);
   }
}
