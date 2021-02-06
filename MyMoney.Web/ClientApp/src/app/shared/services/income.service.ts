import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';
import {
   IncomeApi,
   IDeleteResultDto,
   IIncomeListDto,
   IUpdateResultDto,
   IRecurringIncomeDto,
   IIncomeDto
} from '../api';
import {
   DeleteIncomeAction,
   RefreshIncomesAction,
   SetIncomesAction,
   UpdateIncomeAction,
   UpdateIncomesSearchAction
} from '../state/actions';
import { IAppState } from '../state/app-state';
import { selectIncomesSearchParameters, selectIncome } from '../state/selectors/income.selector';
import { IDateRangeModel, IIncomeModel, IIncomesSearch } from '../state/types';


@Injectable({ providedIn: 'root' })
export class IncomeService {

   constructor(private readonly incomeApi: IncomeApi, private readonly store: Store<IAppState>) {
      this.store.select(selectIncomesSearchParameters).subscribe((search: IIncomesSearch) => {
         if (!search.refresh) {
            return;
         }

         this.getIncomes(search.dateRange)
            .subscribe((response: IIncomeListDto) => this.store.dispatch(new SetIncomesAction(response.incomes)));
      });
   }

   public getIncomes(dateRange: IDateRangeModel): Observable<IIncomeListDto> {
      return this.incomeApi.list(dateRange);
   }

   public getIncomesByDate(date: Date): Observable<IIncomeListDto> {
      return this.incomeApi.listCount({ date, count: 10 });
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

   public updateDate(dateRange: IDateRangeModel): void {
      this.store.dispatch(new UpdateIncomesSearchAction(dateRange));
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

   public realiseTransaction(recurringTransactionId: number, date: string): Observable<IIncomeDto> {
      return this.incomeApi.realise({ id: recurringTransactionId, date });
   }

   public addRecurringTransaction(transaction: IRecurringIncomeDto): Observable<boolean> {
      return this.incomeApi
         .addRecurring(transaction)
         .pipe(map(() => {
            this.store.dispatch(new RefreshIncomesAction());
            return true;
         }));
   }

   public findRecurringTransaction(transactionId: number): Observable<IRecurringIncomeDto> {
      return this.incomeApi.findRecurring({ id: transactionId });
   }

   public editRecurringTransaction(transaction: IRecurringIncomeDto): Observable<boolean> {
      return this.incomeApi
         .updateRecurring(transaction)
         .pipe(map((status: IUpdateResultDto) => {
            if (status.success) {
               this.store.dispatch(new RefreshIncomesAction());
            }
            return status.success;
         }));
   }

   public deleteRecurringTransaction(transactionId: number): void {
      this.incomeApi
         .deleteRecurring({ id: transactionId })
         .subscribe((status: IDeleteResultDto) => {
            if (status.success) {
               this.store.dispatch(new DeleteIncomeAction(transactionId));
            }
         });
   }
}
