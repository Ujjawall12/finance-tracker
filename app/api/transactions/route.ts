import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ITransaction, TransactionInput } from '@/lib/models/Transaction';
import { generateId } from '@/lib/data';

export async function GET() {
  try {
    const db = await getDatabase();
    const transactions = await db
      .collection<ITransaction>('transactions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform MongoDB documents to match frontend expectations
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
      createdAt: transaction.createdAt.toISOString(),
    }));

    return NextResponse.json(transformedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TransactionInput = await request.json();
    const { amount, description, category, date, type } = body;

    if (!amount || !description || !category || !date || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const transaction: ITransaction = {
      id: generateId(),
      amount: parseFloat(amount.toString()),
      description,
      category,
      date,
      type,
      createdAt: new Date(),
    };

    const result = await db.collection<ITransaction>('transactions').insertOne(transaction);
    
    if (!result.insertedId) {
      throw new Error('Failed to insert transaction');
    }

    // Return the transaction in the format expected by frontend
    const createdTransaction = {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
      createdAt: transaction.createdAt.toISOString(),
    };

    return NextResponse.json(createdTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}