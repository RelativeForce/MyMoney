import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import {
   IIncomeListDto,
   IIncomeSearchDto,
   IDeleteResultDto,
   IIncomeDto,
   IIdDto,
   IUpdateResultDto
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

   public add(budget: IIncomeDto): Observable<IIncomeDto> {
      return this.api
         .post<IIncomeDto, IIncomeDto>('/Income/Add', budget)
         .pipe(first());
   }

   public update(budget: IIncomeDto): Observable<IUpdateResultDto> {
      return this.api
         .post<IIncomeDto, IUpdateResultDto>('/Income/Update', budget)
         .pipe(first());
   }

   public find(id: IIdDto): Observable<IIncomeDto> {
      return this.api
         .post<IIdDto, IIncomeDto>('/Income/Find', id)
         .pipe(first());
   }
}
