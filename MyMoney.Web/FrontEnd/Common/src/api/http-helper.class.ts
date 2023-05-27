import { Observable, from, map  } from 'rxjs';

export class HttpHelper {
   public post<Req, Res>(url: string, payload: Req, userToken?: string): Observable<Res> {

      if (userToken === undefined) {
         const annonymousRequest = fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
               "Content-Type": "application/json",
            }
         });

         return from(annonymousRequest).pipe(map(r => r.json() as Res));
      }

      const userRequest = fetch(url, {
         method: 'POST',
         body: JSON.stringify(payload),
         headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
         }
      });

      return from(userRequest).pipe(map(r => r.json() as Res));
   }
}
