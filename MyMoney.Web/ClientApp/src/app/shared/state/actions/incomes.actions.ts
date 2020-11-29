import { Action } from '@ngrx/store';
import { IIncomeModel } from '../types';

export enum IncomeActionTypes {
   SetIncomes = 'Set Incomes',
   UpdateIncome = 'Update Income',
   DeleteIncome = 'Delete Income',
   UpdateSearchDate = 'Update Income Search Date',
   RefreshIncomes = 'Refresh Incomes',
}

export class SetIncomesAction implements Action {
   public type: string = IncomeActionTypes.SetIncomes;

   constructor(public readonly incomes: IIncomeModel[]) { }
}

export class UpdateIncomeAction implements Action {
   public type: string = IncomeActionTypes.UpdateIncome;

   constructor(public readonly budget: IIncomeModel) { }
}

export class DeleteIncomeAction implements Action {
   public type: string = IncomeActionTypes.DeleteIncome;

   constructor(public readonly budgetId: number) { }
}

export class UpdateSearchDateAction implements Action {
   public type: string = IncomeActionTypes.UpdateSearchDate;

   constructor(public readonly date: Date) { }
}

export class RefreshIncomesAction implements Action {
   public type: string = IncomeActionTypes.RefreshIncomes;

   constructor() { }
}
