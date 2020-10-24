import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatAll, first, map } from 'rxjs/operators';
import { DeleteResponse, TransactionListResponse, UpdateResponse } from '../interfaces';
import { DeleteTransactionAction, RefreshTransactionsAction, SetTransactionsAction, UpdateDataRangeAction, UpdateTransactionAction } from '../state/actions';
import { IAppState } from '../state/app-state';
import { selectTransactionsSearchParameters, selectTransaction } from '../state/selectors/transaction.selector';
import { IDateRangeModel, ITransactionModel, ITransactionsSearch } from '../state/types';
import { APIService } from './api-service.service';


@Injectable({ providedIn: 'root' })
export class TransactionService {

   constructor(private readonly api: APIService, private readonly store: Store<IAppState>) {
      this.store.select(selectTransactionsSearchParameters).subscribe((search: ITransactionsSearch) => {
         if (!search.refresh) {
            return;
         }

         this.api
            .post<TransactionListResponse>(`/Transaction/List`, search.dateRange)
            .pipe(first())
            .subscribe((response: TransactionListResponse) => this.store.dispatch(new SetTransactionsAction(response.transactions)));
      });
   }

   public deleteTransaction(transactionId: number): void {
      this.api
         .post<DeleteResponse>(`/Transaction/Delete`, { id: transactionId })
         .pipe(first())
         .subscribe((status: DeleteResponse) => {
            if (status.success) {
               this.store.dispatch(new DeleteTransactionAction(transactionId));
            }
         });
   }

   public updateDateRange(dateRange: IDateRangeModel): void {
      this.store.dispatch(new UpdateDataRangeAction(dateRange));
   }

   public addTransaction(transaction: ITransactionModel): Observable<boolean> {
      return this.api
         .post<ITransactionModel>(`/Transaction/Add`, transaction)
         .pipe(first(), map((t) => {
            this.store.dispatch(new RefreshTransactionsAction());
            return true;
         }));
   }

   public editTransaction(transaction: ITransactionModel): Observable<boolean> {
      return this.api
         .post<UpdateResponse>(`/Transaction/Update`, transaction)
         .pipe(first(), map((status: UpdateResponse) => {
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

         return this.api.post<ITransactionModel>(`/Transaction/Find`, { id: transactionId }).pipe(first());
      }), concatAll());
   }
}
