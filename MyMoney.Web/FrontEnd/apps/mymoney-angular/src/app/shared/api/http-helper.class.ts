import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app-state';
import { HttpHelper as CommonHttpHelper }  from '@mymoney/common'
import { ISessionModel } from '../state/types';
import { Observable, map } from 'rxjs';
import { selectCurrentSession } from '../state/selectors/session.selector';

@Injectable({ providedIn: 'root' })
export class HttpHelper extends CommonHttpHelper {
    protected readonly sessionToken$: Observable<string | null>;

    constructor(store: Store<IAppState>) {
        super();
        
        this.sessionToken$ = store
            .select(selectCurrentSession)
            .pipe(map((session: ISessionModel | null) => session?.token ?? null));
    }
}
