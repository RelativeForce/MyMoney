import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';
import { IncomeApi, IDeleteResultDto, IIncomeListDto, IUpdateResultDto } from '../api';
import {
   DeleteIncomeAction,
   RefreshIncomesAction,
   SetIncomesAction,
   UpdateIncomeAction,
   UpdateSearchDateAction
} from '../state/actions';
import { IAppState } from '../state/app-state';
import { selectIncomesSearchParameters, selectIncome } from '../state/selectors/income.selector';
import { IIncomeModel, IIncomesSearch } from '../state/types';


@Injectable({ providedIn: 'root' })
export class IncomeService {

   constructor(private readonly incomeApi: IncomeApi, private readonly store: Store<IAppState>) {
      this.store.select(selectIncomesSearchParameters).subscribe((search: IIncomesSearch) => {
         if (!search.refresh) {
            return;
         }

         this.getIncomes(search.date)
            .subscribe((response: IIncomeListDto) => this.store.dispatch(new SetIncomesAction(response.incomes)));
      });
   }

   public getIncomes(date: Date) {
      return this.incomeApi.list({ date, count: 10 });
   }

   public deleteIncome(incomeId: number): void {
      this.incomeApi
         .delete({ id: incomeId })
         .subscribe((status: IDeleteResultDto) => {
            if (status.success) {
               this.store.dispatch(new DeleteIncomeAction(incomeId));
            }
         });
   }

   public updateDate(date: Date): void {
      this.store.dispatch(new UpdateSearchDateAction(date));
   }

   public addIncome(income: IIncomeModel): Observable<boolean> {
      return this.incomeApi
         .add(income)
         .pipe(map(() => {
            this.store.dispatch(new RefreshIncomesAction());
            return true;
         }));
   }

   public editIncome(income: IIncomeModel): Observable<boolean> {
      return this.incomeApi
         .update(income)
         .pipe(map((status: IUpdateResultDto) => {
            if (status.success) {
               this.store.dispatch(new UpdateIncomeAction(income));
            }
            return status.success;
         }));
   }

   public findIncome(incomeId: number): Observable<IIncomeModel> {
      return this.store.select(selectIncome(incomeId)).pipe(map((income: IIncomeModel | undefined) => {
         if (income !== undefined) {
            return of(income);
         }

         return this.incomeApi.find({ id: incomeId });
      }), concatAll());
   }

   public refreshIncomes(): void {
      this.store.dispatch(new RefreshIncomesAction());
   }
}
