import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IDeleteResponseDto, IIdDto, ITransactionDto, ITransactionListResponseDto, IUpdateResponseDto } from './dtos.interface';
import { HttpHelper } from './http-helper.class';
import { IDateRangeModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class TransactionApi {

   constructor(private readonly api: HttpHelper) { }

   public list(dateRange: IDateRangeModel): Observable<ITransactionListResponseDto> {
      return this.api
         .post<IDateRangeModel, ITransactionListResponseDto>('/Transaction/List', dateRange)
         .pipe(first());
   }

   public delete(id: IIdDto): Observable<IDeleteResponseDto> {
      return this.api
         .post<IIdDto, IDeleteResponseDto>('/Transaction/Delete', id)
         .pipe(first());
   }

   public add(transaction: ITransactionDto): Observable<ITransactionDto> {
      return this.api
         .post<ITransactionDto, ITransactionDto>('/Transaction/Add', transaction)
         .pipe(first());
   }

   public update(transaction: ITransactionDto): Observable<IUpdateResponseDto> {
      return this.api
         .post<ITransactionDto, IUpdateResponseDto>('/Transaction/Update', transaction)
         .pipe(first());
   }

   public find(id: IIdDto): Observable<ITransactionDto> {
      return this.api
         .post<IIdDto, ITransactionDto>('/Transaction/Find', id)
         .pipe(first());
   }
}
