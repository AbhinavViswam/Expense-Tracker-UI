export interface IExpense {
  categoryId?: string;
  amount: number;
  description: string;
  status:"credited" | "debited" | string;
  createdAt:any
}
