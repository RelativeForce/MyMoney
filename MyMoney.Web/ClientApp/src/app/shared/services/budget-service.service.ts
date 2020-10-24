import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatAll, first, map } from 'rxjs/operators';
import { DeleteResponse, BudgetListResponse, UpdateResponse } from '../interfaces';
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
import { APIService } from './api-service.service';


@Injectable({ providedIn: 'root' })
export class BudgetService {

   constructor(private readonly api: APIService, private readonly store: Store<IAppState>) {
      this.store.select(selectBudgetsSearchParameters).subscribe((search: IBudgetsSearch) => {
         if (!search.refresh) {
            return;
         }

         const monthId = this.toMonthId(search.month, search.year);

         this.api
            .post<BudgetListResponse>(`/Budget/List`, { monthId })
            .pipe(first())
            .subscribe((response: BudgetListResponse) => this.store.dispatch(new SetBudgetsAction(response.budgets)));
      });
   }

   public deleteBudget(budgetId: number): void {
      this.api
         .post<DeleteResponse>(`/Budget/Delete`, { id: budgetId })
         .pipe(first())
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
      return this.api
         .post<IBudgetModel>(`/Budget/Add`, budget)
         .pipe(first(), map((t) => {
            this.store.dispatch(new RefreshBudgetsAction());
            return true;
         }));
   }

   public editBudget(budget: IBudgetModel): Observable<boolean> {
      return this.api
         .post<UpdateResponse>(`/Budget/Update`, budget)
         .pipe(first(), map((status: UpdateResponse) => {
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

         return this.api.post<IBudgetModel>(`/Budget/Find`, { id: budgetId }).pipe(first());
      }), concatAll());
   }
}
