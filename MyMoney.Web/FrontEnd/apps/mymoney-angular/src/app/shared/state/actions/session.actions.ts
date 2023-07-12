import { Action } from '@ngrx/store';
import { IUserDto } from '@mymoney-common/api';

// eslint-disable-next-line no-shadow
export enum SessionActionTypes {
   startSession = 'Start login session',
   clearSession = 'Clear session',
   setUser = 'Set User',
}

export class StartSessionAction implements Action {
   public type: string = SessionActionTypes.startSession;

   constructor(public readonly token: string, public readonly sessionEnd: string) {}
}

export class ClearSessionAction implements Action {
   public type: string = SessionActionTypes.clearSession;
}

export class SetUserAction implements Action {
   public type: string = SessionActionTypes.setUser;

   constructor(public readonly user: IUserDto) {}
}
