import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IRunningTotalSearchDto, IRunningTotalListDto } from './dtos.interface';
import { HttpHelper } from './http-helper.class';

@Injectable({ providedIn: 'root' })
export class HomeApi {

   constructor(private readonly api: HttpHelper) { }

   public runningTotal(request: IRunningTotalSearchDto): Observable<IRunningTotalListDto> {
      return this.api
         .post<IRunningTotalSearchDto, IRunningTotalListDto>('/Home/RunningTotal', request)
         .pipe(first());
   }
}
