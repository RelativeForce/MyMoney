import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { BudgetListResponse, BudgetRequest, DeleteResponse, IdRequest, UpdateResponse } from '../interfaces';
import { APIService } from '../services';
import { IBudgetModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class BudgetApi {

   constructor(private readonly api: APIService) { }

   public list(request: BudgetRequest): Observable<BudgetListResponse> {
      return this.api
         .post<BudgetListResponse>('/Budget/List', request)
         .pipe(first());
   }

   public delete(id: IdRequest): Observable<DeleteResponse> {
      return this.api
         .post<DeleteResponse>('/Budget/Delete', id)
         .pipe(first());
   }

   public add(budget: IBudgetModel): Observable<IBudgetModel> {
      return this.api
         .post<IBudgetModel>('/Budget/Add', budget)
         .pipe(first());
   }

   public update(budget: IBudgetModel): Observable<UpdateResponse> {
      return this.api
         .post<UpdateResponse>('/Budget/Update', budget)
         .pipe(first());
   }

   public find(id: IdRequest): Observable<IBudgetModel> {
      return this.api
         .post<IBudgetModel>('/Budget/Find', id)
         .pipe(first());
   }
}
