import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app-state';
import { selectCurrentSession } from '../state/selectors/session.selector';
import { concatAll, map } from 'rxjs/operators';
import { ISessionModel } from '../state/types';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
   constructor(private store: Store<IAppState>) { }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // add authorization header with jwt token if available
      return this.store
         .select(selectCurrentSession)
         .pipe(
            map((session: ISessionModel | null) => {
               if (session !== null) {
                  request = request.clone({
                     setHeaders: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        Authorization: `Bearer ${session.token}`
                     }
                  });
               }
               return next.handle(request);
            }),
            concatAll());
   }
}
