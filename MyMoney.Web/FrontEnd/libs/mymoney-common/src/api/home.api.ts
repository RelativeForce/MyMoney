import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IRunningTotalSearchDto, IRunningTotalListDto } from './dtos';
import { HttpHelper } from './http-helper.class';

export class HomeApi {
   constructor(private readonly api: HttpHelper) {}

   public runningTotal(request: IRunningTotalSearchDto): Observable<IRunningTotalListDto> {
      return this.api.post<IRunningTotalSearchDto, IRunningTotalListDto>('/Home/RunningTotal', request).pipe(first());
   }
}
