import { Action } from '@ngrx/store';
import { IDateRangeModel, IIncomeModel } from '../types';

// eslint-disable-next-line no-shadow
export enum IncomeActionTypes {
   setIncomes = 'Set Incomes',
   updateIncome = 'Update Income',
   deleteIncome = 'Delete Income',
   updateSearchDate = 'Update Income Search Date',
   refreshIncomes = 'Refresh Incomes',
}

export class SetIncomesAction implements Action {
   public type: string = IncomeActionTypes.setIncomes;

   constructor(public readonly incomes: IIncomeModel[]) { }
}

export class UpdateIncomeAction implements Action {
   public type: string = IncomeActionTypes.updateIncome;

   constructor(public readonly income: IIncomeModel) { }
}

export class DeleteIncomeAction implements Action {
   public type: string = IncomeActionTypes.deleteIncome;

   constructor(public readonly incomeId: number) { }
}

export class UpdateIncomesSearchAction implements Action {
   public type: string = IncomeActionTypes.updateSearchDate;

   constructor(public readonly dateRange: IDateRangeModel) { }
}

export class RefreshIncomesAction implements Action {
   public type: string = IncomeActionTypes.refreshIncomes;

   constructor() { }
}
