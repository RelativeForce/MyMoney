import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { DeleteResponse, IdRequest, ITransactionDto, TransactionListResponse, UpdateResponse } from './dtos';
import { HttpHelper } from './http-helper.class';
import { IDateRangeModel } from '../state/types';

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

   public add(transaction: ITransactionDto): Observable<ITransactionDto> {
      return this.api
         .post<ITransactionDto, ITransactionDto>('/Transaction/Add', transaction)
         .pipe(first());
   }

   public update(transaction: ITransactionDto): Observable<UpdateResponse> {
      return this.api
         .post<ITransactionDto, UpdateResponse>('/Transaction/Update', transaction)
         .pipe(first());
   }

   public find(id: IdRequest): Observable<ITransactionDto> {
      return this.api
         .post<IdRequest, ITransactionDto>('/Transaction/Find', id)
         .pipe(first());
   }
}
