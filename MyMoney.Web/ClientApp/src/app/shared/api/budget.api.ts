import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { BudgetListResponse, BudgetRequest, DeleteResponse, IdRequest, UpdateResponse } from './dtos';
import { APIService } from '../services';
import { IBudgetModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class BudgetApi {

   constructor(private readonly api: APIService) { }

   public list(request: BudgetRequest): Observable<BudgetListResponse> {
      return this.api
         .post<BudgetRequest, BudgetListResponse>('/Budget/List', request)
         .pipe(first());
   }

   public delete(id: IdRequest): Observable<DeleteResponse> {
      return this.api
         .post<IdRequest, DeleteResponse>('/Budget/Delete', id)
         .pipe(first());
   }

   public add(budget: IBudgetModel): Observable<IBudgetModel> {
      return this.api
         .post<IBudgetModel, IBudgetModel>('/Budget/Add', budget)
         .pipe(first());
   }

   public update(budget: IBudgetModel): Observable<UpdateResponse> {
      return this.api
         .post<IBudgetModel, UpdateResponse>('/Budget/Update', budget)
         .pipe(first());
   }

   public find(id: IdRequest): Observable<IBudgetModel> {
      return this.api
         .post<IdRequest, IBudgetModel>('/Budget/Find', id)
         .pipe(first());
   }
}
