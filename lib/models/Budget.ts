import { ObjectId } from 'mongodb';

export interface IBudget {
  _id?: ObjectId;
  id: string;
  categoryId: string;
  amount: number;
  month: string;
  spent: number;
  createdAt: Date;
}

export interface BudgetInput {
  categoryId: string;
  amount: number;
  month: string;
}