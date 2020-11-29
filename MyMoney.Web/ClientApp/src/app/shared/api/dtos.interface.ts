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
   date: string;
   name: string;
}

export class IIncomeSearchDto {
   date: Date;
   count: number;
}

export class IBudgetSearchDto {
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

export class IIdDto {
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
}

export interface ITransactionListDto {
   transactions: ITransactionDto[];
}

export interface IUpdateResultDto {
   success: boolean;
   error: string;
}
