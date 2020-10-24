import { Action } from '@ngrx/store';
import { IDateRangeModel, IBudgetModel } from '../types';

export enum BudgetActionTypes {
   SetBudgets = 'Set Budgets',
   UpdateBudget = 'Update Budget',
   DeleteBudget = 'Delete Budget',
   UpdateMonthId = 'Update Month Id',
   RefreshBudgets = 'Refresh Budgets',
}

export class SetBudgetsAction implements Action {
   public type: string = BudgetActionTypes.SetBudgets;

   constructor(public readonly budgets: IBudgetModel[]) { }
}

export class UpdateBudgetAction implements Action {
   public type: string = BudgetActionTypes.UpdateBudget;

   constructor(public readonly budget: IBudgetModel) { }
}

export class DeleteBudgetAction implements Action {
   public type: string = BudgetActionTypes.DeleteBudget;

   constructor(public readonly budgetId: number) { }
}

export class UpdateSearchMonthIdAction implements Action {
   public type: string = BudgetActionTypes.UpdateMonthId;

   constructor(public readonly month: number, public readonly year: number) { }
}

export class RefreshBudgetsAction implements Action {
   public type: string = BudgetActionTypes.RefreshBudgets;

   constructor() { }
}
