import { Action } from '@ngrx/store';
import { IUserDto } from '../../api';

export enum SessionActionTypes {
   StartSession = 'Start login session',
   ClearSession = 'Clear session',
   SetUser = 'Set User',
}

export class StartSessionAction implements Action {
   public type: string = SessionActionTypes.StartSession;

   constructor(public readonly token: string, public readonly sessionEnd: string) { }
}

export class ClearSessionAction implements Action {
   public type: string = SessionActionTypes.ClearSession;

   constructor() { }
}

export class SetUserAction implements Action {
   public type: string = SessionActionTypes.SetUser;

   constructor(public readonly user: IUserDto) { }
}
