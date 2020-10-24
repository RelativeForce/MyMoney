import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { DeleteResponse, IdRequest, TransactionListResponse, UpdateResponse } from './dtos';
import { HttpHelper } from './http-helper.class';
import { IDateRangeModel, ITransactionModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class TransactionApi {

   constructor(private readonly api: HttpHelper) { }

   public list(dateRange: IDateRangeModel): Observable<TransactionListResponse> {
      return this.api
         .post<IDateRangeModel, TransactionListResponse>('/Transaction/List', dateRange)
         .pipe(first());
   }

   public delete(id: IdRequest): Observable<DeleteResponse> {
      return this.api
         .post<IdRequest, DeleteResponse>('/Transaction/Delete', id)
         .pipe(first());
   }

   public add(transaction: ITransactionModel): Observable<ITransactionModel> {
      return this.api
         .post<ITransactionModel, ITransactionModel>('/Transaction/Add', transaction)
         .pipe(first());
   }

   public update(transaction: ITransactionModel): Observable<UpdateResponse> {
      return this.api
         .post<ITransactionModel, UpdateResponse>('/Transaction/Update', transaction)
         .pipe(first());
   }

   public find(id: IdRequest): Observable<ITransactionModel> {
      return this.api
         .post<IdRequest, ITransactionModel>('/Transaction/Find', id)
         .pipe(first());
   }
}
