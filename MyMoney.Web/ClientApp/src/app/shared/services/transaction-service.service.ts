import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionViewModel } from '../classes';
import { DateRangeModel, DeleteResponse, TransactionListResponse, TransactionModel, UpdateResponse } from '../interfaces';
import { APIService } from './api-service.service';


@Injectable({ providedIn: 'root' })
export class TransactionService {

   constructor(private readonly api: APIService) { }

   public deleteTransaction(transactionId: number): Observable<boolean> {
      return this.api
         .post<DeleteResponse>(`/Transaction/Delete`, { id: transactionId })
         .pipe(map((status: DeleteResponse) => status.success));
   }

   public listTransactions(dateRange: DateRangeModel): Observable<TransactionViewModel[]> {
      return this.api
         .post<TransactionListResponse>(`/Transaction/List`, dateRange)
         .pipe(map((transactions: TransactionListResponse) => transactions.transactions.map(t => new TransactionViewModel(t))));
   }

   public addTransaction(transaction: TransactionModel): Observable<boolean> {
      return this.api
         .post<TransactionModel>(`/Transaction/Add`, transaction)
         .pipe(map(() => true));
   }

   public editTransaction(transaction: TransactionModel): Observable<boolean> {
      return this.api
         .post<UpdateResponse>(`/Transaction/Update`, transaction)
         .pipe(map((status: UpdateResponse) => status.success));
   }

   public findTransaction(transactionId: number): Observable<TransactionModel> {
      return this.api
         .post<TransactionModel>(`/Transaction/Find`, { id: transactionId });
   }
}
