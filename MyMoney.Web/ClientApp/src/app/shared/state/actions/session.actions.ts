import { Action } from '@ngrx/store';

export enum SessionActionTypes {
   StartSession = 'Start login session',
   ClearSession = 'Clear session'
}

export class StartSessionAction implements Action {
   public type: string = SessionActionTypes.StartSession;

   constructor(public readonly token: string, public readonly sessionEnd: string) { }
}

export class ClearSessionAction implements Action {
   public type: string = SessionActionTypes.ClearSession;

   constructor() { }
}

