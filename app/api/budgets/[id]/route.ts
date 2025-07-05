import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { IBudget } from '@/lib/models/Budget';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const budget = await db
      .collection<IBudget>('budgets')
      .findOne({ id: params.id });
    
    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    const transformedBudget = {
      id: budget.id,
      categoryId: budget.categoryId,
      amount: budget.amount,
      month: budget.month,
      spent: budget.spent,
    };

    return NextResponse.json(transformedBudget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget' },
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
    
    const updateData: Partial<IBudget> = {};
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount.toString());
    if (body.month !== undefined) updateData.month = body.month;
    if (body.spent !== undefined) updateData.spent = parseFloat(body.spent.toString());

    const result = await db
      .collection<IBudget>('budgets')
      .updateOne({ id: params.id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    const updatedBudget = await db
      .collection<IBudget>('budgets')
      .findOne({ id: params.id });

    if (!updatedBudget) {
      return NextResponse.json(
        { error: 'Failed to fetch updated budget' },
        { status: 500 }
      );
    }

    const transformedBudget = {
      id: updatedBudget.id,
      categoryId: updatedBudget.categoryId,
      amount: updatedBudget.amount,
      month: updatedBudget.month,
      spent: updatedBudget.spent,
    };

    return NextResponse.json(transformedBudget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
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
      .collection<IBudget>('budgets')
      .deleteOne({ id: params.id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}