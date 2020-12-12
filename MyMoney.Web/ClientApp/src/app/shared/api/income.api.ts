import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import {
   IIncomeListDto,
   IIncomeSearchDto,
   IDeleteResultDto,
   IIncomeDto,
   IIdDto,
   IUpdateResultDto,
   IRunningTotalSearchDto,
   IRunningTotalListDto
} from './dtos.interface';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class IncomeApi {

   constructor(private readonly api: HttpHelper) { }

   public list(request: IIncomeSearchDto): Observable<IIncomeListDto> {
      return this.api
         .post<IIncomeSearchDto, IIncomeListDto>('/Income/List', request)
         .pipe(first());
   }

   public delete(id: IIdDto): Observable<IDeleteResultDto> {
      return this.api
         .post<IIdDto, IDeleteResultDto>('/Income/Delete', id)
         .pipe(first());
   }

   public add(income: IIncomeDto): Observable<IIncomeDto> {
      return this.api
         .post<IIncomeDto, IIncomeDto>('/Income/Add', income)
         .pipe(first());
   }

   public update(income: IIncomeDto): Observable<IUpdateResultDto> {
      return this.api
         .post<IIncomeDto, IUpdateResultDto>('/Income/Update', income)
         .pipe(first());
   }

   public runningTotal(request: IRunningTotalSearchDto): Observable<IRunningTotalListDto> {
      return this.api
         .post<IRunningTotalSearchDto, IRunningTotalListDto>('/Income/RunningTotal', request)
         .pipe(first());
   }

   public find(id: IIdDto): Observable<IIncomeDto> {
      return this.api
         .post<IIdDto, IIncomeDto>('/Income/Find', id)
         .pipe(first());
   }
}
