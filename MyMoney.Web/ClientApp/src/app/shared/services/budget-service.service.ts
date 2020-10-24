import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';
import { BudgetApi, DeleteResponse, IBudgetListResponseDto, UpdateResponse } from '../api';
import {
   DeleteBudgetAction,
   RefreshBudgetsAction,
   SetBudgetsAction,
   UpdateBudgetAction,
   UpdateSearchMonthIdAction
} from '../state/actions';
import { IAppState } from '../state/app-state';
import { selectBudgetsSearchParameters, selectBudget } from '../state/selectors/budget.selector';
import { IBudgetModel, IBudgetsSearch } from '../state/types';


@Injectable({ providedIn: 'root' })
export class BudgetService {

   constructor(private readonly budgetApi: BudgetApi, private readonly store: Store<IAppState>) {
      this.store.select(selectBudgetsSearchParameters).subscribe((search: IBudgetsSearch) => {
         if (!search.refresh) {
            return;
         }

         this.getBudgetsForMonth(search.month, search.year)
            .subscribe((response: IBudgetListResponseDto) => this.store.dispatch(new SetBudgetsAction(response.budgets)));
      });
   }

   public getBudgetsForMonth(month: number, year: number) {
      const monthId = this.toMonthId(month, year);

      return this.budgetApi.list({ monthId });
   }

   public deleteBudget(budgetId: number): void {
      this.budgetApi
         .delete({ id: budgetId })
         .subscribe((status: DeleteResponse) => {
            if (status.success) {
               this.store.dispatch(new DeleteBudgetAction(budgetId));
            }
         });
   }

   public toMonthId(month: number, year: number): string {
      return `${year}${month < 10 ? '0' + month : month}`;
   }

   public updateMonthId(month: number, year: number): void {
      this.store.dispatch(new UpdateSearchMonthIdAction(month, year));
   }

   public addBudget(budget: IBudgetModel): Observable<boolean> {
      return this.budgetApi
         .add(budget)
         .pipe(map(() => {
            this.store.dispatch(new RefreshBudgetsAction());
            return true;
         }));
   }

   public editBudget(budget: IBudgetModel): Observable<boolean> {
      return this.budgetApi
         .update(budget)
         .pipe(map((status: UpdateResponse) => {
            if (status.success) {
               this.store.dispatch(new UpdateBudgetAction(budget));
            }
            return status.success;
         }));
   }

   public findBudget(budgetId: number): Observable<IBudgetModel> {
      return this.store.select(selectBudget(budgetId)).pipe(map((budget: IBudgetModel | undefined) => {
         if (budget !== undefined) {
            return of(budget);
         }

         return this.budgetApi.find({ id: budgetId });
      }), concatAll());
   }

   public refreshBudgets(): void {
      this.store.dispatch(new RefreshBudgetsAction());
   }
}
