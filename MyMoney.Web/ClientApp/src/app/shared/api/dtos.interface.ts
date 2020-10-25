export interface IBudgetDto {
   id: number;
   amount: number;
   notes: string;
   month: number;
   year: number;
   name: string;
   remaining: number;
}

export class IBudgetListRequestDto {
   month: number;
   year: number;
}

export interface IBudgetListResponseDto {
   budgets: IBudgetDto[];
}

export interface IDateRangeDto {
   start: Date;
   end: Date;
}

export interface IDeleteResponseDto {
   success: boolean;
}

export class IIdDto {
   id: number;
}

export interface ILoginRequestDto {
   email: string;
   password: string;
}

export interface ILoginResponseDto {
   success: boolean;
   error: string;
   token: string;
   validTo: string;
}

export interface IRegisterRequestDto {
   email: string;
   password: string;
   dateOfBirth: Date;
   fullName: string;
}

export interface ITransactionDto {
   date: string;
   description: string;
   amount: number;
   budgetIds: number[];
   id: number;
}

export interface ITransactionListResponseDto {
   transactions: ITransactionDto[];
}

export interface IUpdateResponseDto {
   success: boolean;
   error: string;
}
