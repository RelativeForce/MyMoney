import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import {
   IBudgetListDto,
   IBudgetSearchDto,
   IDeleteResultDto,
   IBudgetDto,
   IIdDto,
   IUpdateResultDto
} from './dtos.interface';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class BudgetApi {

   constructor(private readonly api: HttpHelper) { }

   public list(request: IBudgetSearchDto): Observable<IBudgetListDto> {
      return this.api
         .post<IBudgetSearchDto, IBudgetListDto>('/Budget/List', request)
         .pipe(first());
   }

   public delete(id: IIdDto): Observable<IDeleteResultDto> {
      return this.api
         .post<IIdDto, IDeleteResultDto>('/Budget/Delete', id)
         .pipe(first());
   }

   public add(budget: IBudgetDto): Observable<IBudgetDto> {
      return this.api
         .post<IBudgetDto, IBudgetDto>('/Budget/Add', budget)
         .pipe(first());
   }

   public update(budget: IBudgetDto): Observable<IUpdateResultDto> {
      return this.api
         .post<IBudgetDto, IUpdateResultDto>('/Budget/Update', budget)
         .pipe(first());
   }

   public find(id: IIdDto): Observable<IBudgetDto> {
      return this.api
         .post<IIdDto, IBudgetDto>('/Budget/Find', id)
         .pipe(first());
   }
}
