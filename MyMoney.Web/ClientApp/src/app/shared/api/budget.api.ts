import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IBudgetListResponseDto, IBudgetListRequestDto, DeleteResponse, IBudgetDto, IdRequest, UpdateResponse } from './dtos';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class BudgetApi {

   constructor(private readonly api: HttpHelper) { }

   public list(request: IBudgetListRequestDto): Observable<IBudgetListResponseDto> {
      return this.api
         .post<IBudgetListRequestDto, IBudgetListResponseDto>('/Budget/List', request)
         .pipe(first());
   }

   public delete(id: IdRequest): Observable<DeleteResponse> {
      return this.api
         .post<IdRequest, DeleteResponse>('/Budget/Delete', id)
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

   public find(id: IdRequest): Observable<IBudgetDto> {
      return this.api
         .post<IdRequest, IBudgetDto>('/Budget/Find', id)
         .pipe(first());
   }
}
