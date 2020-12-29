import { Action } from '@ngrx/store';
import { IDateRangeModel, IIncomeModel } from '../types';

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

   constructor(public readonly income: IIncomeModel) { }
}

export class DeleteIncomeAction implements Action {
   public type: string = IncomeActionTypes.DeleteIncome;

   constructor(public readonly incomeId: number) { }
}

export class UpdateSearchDateAction implements Action {
   public type: string = IncomeActionTypes.UpdateSearchDate;

   constructor(public readonly dateRange: IDateRangeModel) { }
}

export class RefreshIncomesAction implements Action {
   public type: string = IncomeActionTypes.RefreshIncomes;

   constructor() { }
}
