import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRunningTotalListDto, HomeApi } from '../api';
import { IDateRangeModel } from '../state/types';

@Injectable({ providedIn: 'root' })
export class HomeService {

   constructor(private readonly homeApi: HomeApi) { }

   public getRunningTotal(initialTotal: number, dateRange: IDateRangeModel): Observable<IRunningTotalListDto> {
      return this.homeApi.runningTotal({ dateRange, initialTotal });
   }
}
