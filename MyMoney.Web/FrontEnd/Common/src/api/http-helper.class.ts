import { Observable, from, map, switchMap  } from 'rxjs';

export class HttpHelper {
   public post<RequestBodyType, ResponseBodyType>(url: string, payload: RequestBodyType, userToken?: string): Observable<ResponseBodyType> {

      if (userToken === undefined) {
         const annonymousRequest = fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
               "Content-Type": "application/json",
            }
         });

         return HttpHelper.send<ResponseBodyType>(annonymousRequest);
      }

      const userRequest = fetch(url, {
         method: 'POST',
         body: JSON.stringify(payload),
         headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
         }
      });

      return HttpHelper.send<ResponseBodyType>(userRequest);
   }

   private static send<ResponseBodyType>(request: Promise<Response>) : Observable<ResponseBodyType>{
      return from(request).pipe(switchMap((r: Response) => HttpHelper.toResult<ResponseBodyType>(r.json())));
   }

   private static toResult<ResponseBodyType>(jsonBody: Promise<any>) : Observable<ResponseBodyType> {
      return from(jsonBody).pipe(map(rb => rb as ResponseBodyType));
   }
}
