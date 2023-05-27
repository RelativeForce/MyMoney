import { Action } from '@ngrx/store';
import { IBudgetModel } from '../types';

// eslint-disable-next-line no-shadow
export enum BudgetActionTypes {
   setBudgets = 'Set Budgets',
   updateBudget = 'Update Budget',
   deleteBudget = 'Delete Budget',
   updateMonthId = 'Update Month Id',
   refreshBudgets = 'Refresh Budgets',
}

export class SetBudgetsAction implements Action {
   public type: string = BudgetActionTypes.setBudgets;

   constructor(public readonly budgets: IBudgetModel[]) { }
}

export class UpdateBudgetAction implements Action {
   public type: string = BudgetActionTypes.updateBudget;

   constructor(public readonly budget: IBudgetModel) { }
}

export class DeleteBudgetAction implements Action {
   public type: string = BudgetActionTypes.deleteBudget;

   constructor(public readonly budgetId: number) { }
}

export class UpdateSearchMonthIdAction implements Action {
   public type: string = BudgetActionTypes.updateMonthId;

   constructor(public readonly month: number, public readonly year: number) { }
}

export class RefreshBudgetsAction implements Action {
   public type: string = BudgetActionTypes.refreshBudgets;
}
