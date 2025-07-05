import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ITransaction } from '@/lib/models/Transaction';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const transaction = await db
      .collection<ITransaction>('transactions')
      .findOne({ id: params.id });
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transformedTransaction = {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
      createdAt: transaction.createdAt.toISOString(),
    };

    return NextResponse.json(transformedTransaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    
    const updateData: Partial<ITransaction> = {};
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount.toString());
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.type !== undefined) updateData.type = body.type;

    const result = await db
      .collection<ITransaction>('transactions')
      .updateOne({ id: params.id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const updatedTransaction = await db
      .collection<ITransaction>('transactions')
      .findOne({ id: params.id });

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: 'Failed to fetch updated transaction' },
        { status: 500 }
      );
    }

    const transformedTransaction = {
      id: updatedTransaction.id,
      amount: updatedTransaction.amount,
      description: updatedTransaction.description,
      category: updatedTransaction.category,
      date: updatedTransaction.date,
      type: updatedTransaction.type,
      createdAt: updatedTransaction.createdAt.toISOString(),
    };

    return NextResponse.json(transformedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const result = await db
      .collection<ITransaction>('transactions')
      .deleteOne({ id: params.id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}