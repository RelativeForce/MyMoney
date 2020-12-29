import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpHelper {

   constructor(private readonly http: HttpClient) { }

   public post<Req, Res>(url: string, payload: Req, userToken?: string): Observable<Res> {

      if (userToken === undefined) {
         return this.http.post<Res>(url, payload);
      }

      // This is only used when there is no user token in the state
      return this.http.post<Res>(url, payload, {
         headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${userToken}`
         }
      });
   }
}
