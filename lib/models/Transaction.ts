import { ObjectId } from 'mongodb';

export interface ITransaction {
  _id?: ObjectId;
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  createdAt: Date;
}

export interface TransactionInput {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}