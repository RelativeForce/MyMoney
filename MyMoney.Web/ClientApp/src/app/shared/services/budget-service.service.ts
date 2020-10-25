import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';
import { BudgetApi, IDeleteResponseDto, IBudgetListResponseDto, IUpdateResponseDto } from '../api';
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
      return this.budgetApi.list({ month, year });
   }

   public deleteBudget(budgetId: number): void {
      this.budgetApi
         .delete({ id: budgetId })
         .subscribe((status: IDeleteResponseDto) => {
            if (status.success) {
               this.store.dispatch(new DeleteBudgetAction(budgetId));
            }
         });
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
         .pipe(map((status: IUpdateResponseDto) => {
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
