import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';
import {
   TransactionApi,
   IDeleteResultDto,
   ITransactionListDto,
   IUpdateResultDto,
   IRecurringTransactionDto,
   ITransactionDto
} from '../api';
import {
   DeleteRecurringTransactionAction,
   DeleteTransactionAction,
   RefreshTransactionsAction,
   SetTransactionsAction,
   UpdateDataRangeAction,
   UpdateTransactionAction
} from '../state/actions';
import { IAppState } from '../state/app-state';
import { selectTransactionsSearchParameters, selectTransaction } from '../state/selectors/transaction.selector';
import { IDateRangeModel, ITransactionModel, ITransactionsSearch } from '../state/types';


@Injectable({ providedIn: 'root' })
export class TransactionService {

   constructor(private readonly transactionApi: TransactionApi, private readonly store: Store<IAppState>) {
      this.store.select(selectTransactionsSearchParameters).subscribe((search: ITransactionsSearch) => {
         if (!search.refresh) {
            return;
         }

         this.getTransactionsInRange(search.dateRange)
            .subscribe((response: ITransactionListDto) => this.store.dispatch(new SetTransactionsAction(response.transactions)));
      });
   }

   public getTransactionsInRange(dateRange: IDateRangeModel): Observable<ITransactionListDto> {
      return this.transactionApi.list(dateRange);
   }

   public deleteTransaction(transactionId: number): void {
      this.transactionApi
         .delete({ id: transactionId })
         .subscribe((status: IDeleteResultDto) => {
            if (status.success) {
               this.store.dispatch(new DeleteTransactionAction(transactionId));
            }
         });
   }

   public updateDateRange(dateRange: IDateRangeModel): void {
      this.store.dispatch(new UpdateDataRangeAction(dateRange));
   }

   public addTransaction(transaction: ITransactionModel): Observable<boolean> {
      return this.transactionApi
         .add(transaction)
         .pipe(map(() => {
            this.store.dispatch(new RefreshTransactionsAction());
            return true;
         }));
   }

   public editTransaction(transaction: ITransactionModel): Observable<boolean> {
      return this.transactionApi
         .update(transaction)
         .pipe(map((status: IUpdateResultDto) => {
            if (status.success) {
               this.store.dispatch(new UpdateTransactionAction(transaction));
            }
            return status.success;
         }));
   }

   public findTransaction(transactionId: number): Observable<ITransactionModel> {
      return this.store.select(selectTransaction(transactionId)).pipe(map((transaction: ITransactionModel | undefined) => {
         if (transaction !== undefined) {
            return of(transaction);
         }

         return this.transactionApi.find({ id: transactionId });
      }), concatAll());
   }

   public realiseTransaction(recurringTransactionId: number, date: string): Observable<ITransactionDto> {
      return this.transactionApi.realise({ id: recurringTransactionId, date });
   }

   public refreshTransactions(): void {
      this.store.dispatch(new RefreshTransactionsAction());
   }

   public addRecurringTransaction(transaction: IRecurringTransactionDto): Observable<boolean> {
      return this.transactionApi
         .addRecurring(transaction)
         .pipe(map(() => {
            this.store.dispatch(new RefreshTransactionsAction());
            return true;
         }));
   }

   public findRecurringTransaction(transactionId: number): Observable<IRecurringTransactionDto> {
      return this.transactionApi.findRecurring({ id: transactionId });
   }

   public editRecurringTransaction(transaction: IRecurringTransactionDto): Observable<boolean> {
      return this.transactionApi
         .updateRecurring(transaction)
         .pipe(map((status: IUpdateResultDto) => {
            if (status.success) {
               this.store.dispatch(new RefreshTransactionsAction());
            }
            return status.success;
         }));
   }

   public deleteRecurringTransaction(transactionId: number): void {
      this.transactionApi
         .deleteRecurring({ id: transactionId })
         .subscribe((status: IDeleteResultDto) => {
            if (status.success) {
               this.store.dispatch(new DeleteRecurringTransactionAction(transactionId));
            }
         });
   }
}
