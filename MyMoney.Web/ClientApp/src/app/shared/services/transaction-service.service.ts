import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';
import { TransactionApi, IDeleteResultDto, ITransactionListDto, IUpdateResultDto } from '../api';
import { DeleteTransactionAction, RefreshTransactionsAction, SetTransactionsAction, UpdateDataRangeAction, UpdateTransactionAction } from '../state/actions';
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

         this.transactionApi
            .list(search.dateRange)
            .subscribe((response: ITransactionListDto) => this.store.dispatch(new SetTransactionsAction(response.transactions)));
      });
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
         .pipe(map((t) => {
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

   public refreshTransactions(): void {
      this.store.dispatch(new RefreshTransactionsAction());
   }
}
