import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import {
   IIncomeListDto,
   IDeleteResultDto,
   IIncomeDto,
   IIdDto,
   IUpdateResultDto,
   IDateRangeDto,
   IIncomeSearchDto,
   IRecurringEntityChildDto,
   IRecurringIncomeDto,
} from './dtos';
import { HttpHelper } from './http-helper.class';

export class IncomeApi {
   constructor(private readonly api: HttpHelper) {}

   public list(request: IDateRangeDto): Observable<IIncomeListDto> {
      return this.api.post<IDateRangeDto, IIncomeListDto>('/Income/List', request).pipe(first());
   }

   public listCount(request: IIncomeSearchDto): Observable<IIncomeListDto> {
      return this.api.post<IIncomeSearchDto, IIncomeListDto>('/Income/ListCount', request).pipe(first());
   }

   public delete(id: IIdDto): Observable<IDeleteResultDto> {
      return this.api.post<IIdDto, IDeleteResultDto>('/Income/Delete', id).pipe(first());
   }

   public add(income: IIncomeDto): Observable<IIncomeDto> {
      return this.api.post<IIncomeDto, IIncomeDto>('/Income/Add', income).pipe(first());
   }

   public update(income: IIncomeDto): Observable<IUpdateResultDto> {
      return this.api.post<IIncomeDto, IUpdateResultDto>('/Income/Update', income).pipe(first());
   }

   public find(id: IIdDto): Observable<IIncomeDto> {
      return this.api.post<IIdDto, IIncomeDto>('/Income/Find', id).pipe(first());
   }

   public realise(child: IRecurringEntityChildDto): Observable<IIncomeDto> {
      return this.api.post<IRecurringEntityChildDto, IIncomeDto>('/Income/Realise', child).pipe(first());
   }

   public addRecurring(income: IRecurringIncomeDto): Observable<IRecurringIncomeDto> {
      return this.api.post<IRecurringIncomeDto, IRecurringIncomeDto>('/Income/AddRecurring', income).pipe(first());
   }

   public findRecurring(id: IIdDto): Observable<IRecurringIncomeDto> {
      return this.api.post<IIdDto, IRecurringIncomeDto>('/Income/FindRecurring', id).pipe(first());
   }

   public updateRecurring(income: IRecurringIncomeDto): Observable<IUpdateResultDto> {
      return this.api.post<IRecurringIncomeDto, IUpdateResultDto>('/Income/UpdateRecurring', income).pipe(first());
   }

   public deleteRecurring(id: IIdDto): Observable<IDeleteResultDto> {
      return this.api.post<IIdDto, IDeleteResultDto>('/Income/DeleteRecurring', id).pipe(first());
   }
}
