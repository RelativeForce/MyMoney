export interface IBudgetDto {
   id: number;
   amount: number;
   notes: string;
   month: number;
   year: number;
   name: string;
   remaining: number;
}

export interface IIncomeDto {
   id: number;
   amount: number;
   remaining: number;
   date: string;
   name: string;
   notes: string;
   parentId: number | null;
   parentFrequency: Frequency | null;
}

export interface IIncomeSearchDto {
   date: Date;
   count: number;
}

export interface IBudgetSearchDto {
   month: number;
   year: number;
}

export interface IBudgetListDto {
   budgets: IBudgetDto[];
}

export interface IIncomeListDto {
   incomes: IIncomeDto[];
}

export interface IDateRangeDto {
   start: Date;
   end: Date;
}

export interface IDeleteResultDto {
   success: boolean;
}

export interface IIdDto {
   id: number;
}

export interface ILoginDto {
   email: string;
   password: string;
}

export interface ILoginResultDto {
   success: boolean;
   error: string;
   token: string;
   validTo: string;
}

export interface IRegisterDto {
   email: string;
   password: string;
   dateOfBirth: Date;
   fullName: string;
}

export interface ITransactionDto {
   date: string;
   description: string;
   notes: string;
   amount: number;
   budgetIds: number[];
   incomeIds: number[];
   id: number;
   parentId: number | null;
   parentFrequency: Frequency | null;
}

export interface ITransactionListDto {
   transactions: ITransactionDto[];
}

export interface IUpdateResultDto {
   success: boolean;
   error: string;
}

export interface IRunningTotalSearchDto {
   initialTotal: number;
   dateRange: IDateRangeDto;
}

export interface IRunningTotalDto {
   id: number;
   name: string;
   text: string;
   date: string;
   delta: number;
   value: number;
   parentId: number | null;
}

export interface IRunningTotalListDto {
   runningTotals: IRunningTotalDto[];
}

export interface IUserDto {
   email: string;
   dateOfBirth: string;
   fullName: string;
}

export interface IBasicResultDto {
   success: boolean;
   error: string;
}

export interface IForgotPasswordDto {
   email: string;
}

export interface IPasswordDto {
   password: string;
}

export enum Frequency {
   day = 0,
   week = 1,
   month = 2,
   year = 3,
   fortnight = 4,
   fourWeek = 5,
}

export interface IRecurringTransactionDto {
   start: string;
   end: string;
   description: string;
   notes: string;
   amount: number;
   id: number;
   recurrence: Frequency;
   children: IRecurringEntityChildDto[];
}

export interface IRecurringEntityChildDto {
   date: string;
   id: number;
}

export interface IRecurringIncomeDto {
   start: string;
   end: string;
   name: string;
   notes: string;
   amount: number;
   id: number;
   recurrence: Frequency;
   children: IRecurringEntityChildDto[];
}
