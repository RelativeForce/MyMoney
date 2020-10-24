import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { DeleteResponse, IdRequest, TransactionListResponse, UpdateResponse } from '../interfaces';
import { APIService } from '../services';
import { IDateRangeModel, ITransactionModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class TransactionApi {

   constructor(private readonly api: APIService) { }

   public list(dateRange: IDateRangeModel): Observable<TransactionListResponse> {
      return this.api
         .post<TransactionListResponse>('/Transaction/List', dateRange)
         .pipe(first());
   }

   public delete(id: IdRequest): Observable<DeleteResponse> {
      return this.api
         .post<DeleteResponse>('/Transaction/Delete', id)
         .pipe(first());
   }

   public add(transaction: ITransactionModel): Observable<ITransactionModel> {
      return this.api
         .post<ITransactionModel>('/Transaction/Add', transaction)
         .pipe(first());
   }

   public update(transaction: ITransactionModel): Observable<UpdateResponse> {
      return this.api
         .post<UpdateResponse>('/Transaction/Update', transaction)
         .pipe(first());
   }

   public find(id: IdRequest): Observable<ITransactionModel> {
      return this.api
         .post<ITransactionModel>('/Transaction/Find', id)
         .pipe(first());
   }
}
