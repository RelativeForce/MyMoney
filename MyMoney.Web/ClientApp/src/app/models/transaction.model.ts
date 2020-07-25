export interface TransactionModel {
  date: string;
  description: string;
  amount: Number;
  budgetIds: Array<Number>;
  id: Number;
}
