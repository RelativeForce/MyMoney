import { Observable, from, map, switchMap  } from 'rxjs';

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

         return HttpHelper.send<Res>(annonymousRequest);
      }

      const userRequest = fetch(url, {
         method: 'POST',
         body: JSON.stringify(payload),
         headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
         }
      });

      return HttpHelper.send<Res>(userRequest);
   }

   private static send<Res>(request: Promise<Response>) : Observable<Res>{
      return from(request).pipe(switchMap((r: Response) => HttpHelper.toResult<Res>(r.json())));
   }

   private static toResult<Res>(jsonBody: Promise<any>) : Observable<Res> {
      return from(jsonBody).pipe(map(rb => rb as Res));
   }
}
