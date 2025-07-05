import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { IBudget, BudgetInput } from '@/lib/models/Budget';
import { generateId } from '@/lib/data';

export async function GET() {
  try {
    const db = await getDatabase();
    const budgets = await db
      .collection<IBudget>('budgets')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform MongoDB documents to match frontend expectations
    const transformedBudgets = budgets.map(budget => ({
      id: budget.id,
      categoryId: budget.categoryId,
      amount: budget.amount,
      month: budget.month,
      spent: budget.spent,
    }));

    return NextResponse.json(transformedBudgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BudgetInput = await request.json();
    const { categoryId, amount, month } = body;

    if (!categoryId || !amount || !month) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Check if budget already exists for this category and month
    const existingBudget = await db
      .collection<IBudget>('budgets')
      .findOne({ categoryId, month });

    if (existingBudget) {
      return NextResponse.json(
        { error: 'Budget already exists for this category and month' },
        { status: 400 }
      );
    }

    const budget: IBudget = {
      id: generateId(),
      categoryId,
      amount: parseFloat(amount.toString()),
      month,
      spent: 0,
      createdAt: new Date(),
    };

    const result = await db.collection<IBudget>('budgets').insertOne(budget);
    
    if (!result.insertedId) {
      throw new Error('Failed to insert budget');
    }

    // Return the budget in the format expected by frontend
    const createdBudget = {
      id: budget.id,
      categoryId: budget.categoryId,
      amount: budget.amount,
      month: budget.month,
      spent: budget.spent,
    };

    return NextResponse.json(createdBudget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}