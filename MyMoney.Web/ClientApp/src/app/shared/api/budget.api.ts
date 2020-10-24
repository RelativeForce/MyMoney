import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IBudgetListResponseDto, IBudgetListRequestDto, IDeleteResponseDto, IBudgetDto, IIdDto, UpdateResponse } from './dtos';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class BudgetApi {

   constructor(private readonly api: HttpHelper) { }

   public list(request: IBudgetListRequestDto): Observable<IBudgetListResponseDto> {
      return this.api
         .post<IBudgetListRequestDto, IBudgetListResponseDto>('/Budget/List', request)
         .pipe(first());
   }

   public delete(id: IIdDto): Observable<IDeleteResponseDto> {
      return this.api
         .post<IIdDto, IDeleteResponseDto>('/Budget/Delete', id)
         .pipe(first());
   }

   public add(budget: IBudgetDto): Observable<IBudgetDto> {
      return this.api
         .post<IBudgetDto, IBudgetDto>('/Budget/Add', budget)
         .pipe(first());
   }

   public update(budget: IBudgetDto): Observable<UpdateResponse> {
      return this.api
         .post<IBudgetDto, UpdateResponse>('/Budget/Update', budget)
         .pipe(first());
   }

   public find(id: IIdDto): Observable<IBudgetDto> {
      return this.api
         .post<IIdDto, IBudgetDto>('/Budget/Find', id)
         .pipe(first());
   }
}
