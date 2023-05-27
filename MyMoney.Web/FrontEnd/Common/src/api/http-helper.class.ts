import { Observable, first, from, map, switchMap  } from 'rxjs';

export abstract class HttpHelper {
   protected readonly abstract sessionToken$: Observable<string | null>;

   public post<RequestBodyType, ResponseBodyType>(url: string, payload: RequestBodyType, userToken?: string): Observable<ResponseBodyType> {
      return this.sessionToken$
         .pipe(first(), switchMap((sessionToken : string | null) => {

            const bearerToken: string | null = userToken ? userToken : (sessionToken ? sessionToken : null);   

            const userRequest = fetch(url, {
               method: 'POST',
               body: JSON.stringify(payload),
               headers: {
                  Authorization: bearerToken ? `Bearer ${bearerToken}` : '',
                  "Content-Type": "application/json",
               }
            });
      
            return HttpHelper.send<ResponseBodyType>(userRequest);
         }));
   }

   private static send<ResponseBodyType>(request: Promise<Response>) : Observable<ResponseBodyType>{
      return from(request).pipe(first(), switchMap((r: Response) => HttpHelper.toResult<ResponseBodyType>(r.json())));
   }

   private static toResult<ResponseBodyType>(jsonBody: Promise<any>) : Observable<ResponseBodyType> {
      return from(jsonBody).pipe(first(), map(rb => rb as ResponseBodyType));
   }
}
