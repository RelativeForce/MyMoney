import { HttpHelper as CommonHttpHelper } from '@mymoney-common/api';
import { Observable, of } from 'rxjs';

export class HttpHelper extends CommonHttpHelper {
    protected sessionToken$: Observable<string | null>;
    constructor(sessionToken: string | null) {
        super();
        this.sessionToken$ = of(sessionToken);
    }
}