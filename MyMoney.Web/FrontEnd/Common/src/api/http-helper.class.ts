import { Observable, first, from, switchMap  } from 'rxjs';

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
      
            return from(HttpHelper.send<ResponseBodyType>(userRequest));
         }));
   }

   private static async send<ResponseBodyType>(request: Promise<Response>) : Promise<ResponseBodyType>{
      const response = await request;

      const responseText = await response.text();

      if (!response.ok) { 
         throw new Error(`Status: ${response.status}\n Response: ${responseText}`);
      }

      return JSON.parse(responseText) as ResponseBodyType;
   }
}
