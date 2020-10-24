import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class HttpHelper {

   constructor(private readonly http: HttpClient) { }

   public post<Req, Res>(url: string, payload: Req): Observable<Res> {
      return this.http.post<Res>(url, payload);
   }
}
