import { HttpHelper as CommonHttpHelper } from '@mymoney-common/api';
import { Observable, of } from 'rxjs';
import { selectCurrentSessionToken } from '../state/session/selectors';
import { IAppState } from '../state/types';

export class HttpHelper extends CommonHttpHelper {
   protected sessionToken$: Observable<string | null>;
   constructor(sessionToken: string | null) {
      super();
      this.sessionToken$ = of(sessionToken);
   }

   public static forCuurentUser(getState: () => unknown): HttpHelper | null {
      const token = selectCurrentSessionToken(getState() as IAppState);

      if (!token) {
         return null;
      }

      return new HttpHelper(token);
   }

   public static forAnnonymous(): HttpHelper {
      return new HttpHelper(null);
   }
}
