import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IDeleteResultDto, IIdDto, ITransactionDto, ITransactionListDto, IUpdateResultDto } from './dtos.interface';
import { HttpHelper } from './http-helper.class';
import { IDateRangeModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class TransactionApi {

   constructor(private readonly api: HttpHelper) { }

   public list(dateRange: IDateRangeModel): Observable<ITransactionListDto> {
      return this.api
         .post<IDateRangeModel, ITransactionListDto>('/Transaction/List', dateRange)
         .pipe(first());
   }

   public delete(id: IIdDto): Observable<IDeleteResultDto> {
      return this.api
         .post<IIdDto, IDeleteResultDto>('/Transaction/Delete', id)
         .pipe(first());
   }

   public add(transaction: ITransactionDto): Observable<ITransactionDto> {
      return this.api
         .post<ITransactionDto, ITransactionDto>('/Transaction/Add', transaction)
         .pipe(first());
   }

   public update(transaction: ITransactionDto): Observable<IUpdateResultDto> {
      return this.api
         .post<ITransactionDto, IUpdateResultDto>('/Transaction/Update', transaction)
         .pipe(first());
   }

   public find(id: IIdDto): Observable<ITransactionDto> {
      return this.api
         .post<IIdDto, ITransactionDto>('/Transaction/Find', id)
         .pipe(first());
   }
}
