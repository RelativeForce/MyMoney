import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class APIService {

   constructor(private readonly http: HttpClient) { }

   public post<T>(url: string, payload: any): Observable<T> {
      return this.http.post<T>(url, payload);
   }
}
