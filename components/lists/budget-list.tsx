'use client';

import { Budget, Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
import { defaultCategories, formatCurrency, getCurrentMonth } from '@/lib/data';

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export const BudgetList = ({ budgets, transactions, onEdit, onDelete }: BudgetListProps) => {
  const currentMonth = getCurrentMonth();
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

  const getBudgetData = (budget: Budget) => {
    const category = defaultCategories.find(c => c.id === budget.categoryId);
    const spent = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.categoryId &&
        t.date.startsWith(budget.month)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
    const remaining = Math.max(0, budget.amount - spent);
    const isOverBudget = spent > budget.amount;

    return {
      category,
      spent,
      percentage,
      remaining,
      isOverBudget,
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Month Budgets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentMonthBudgets.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No budgets set for this month</p>
          ) : (
            currentMonthBudgets.map((budget) => {
              const { category, spent, percentage, remaining, isOverBudget } = getBudgetData(budget);
              
              return (
                <div
                  key={budget.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category?.icon}</span>
                      <span className="font-medium">{category?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(budget)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent: {formatCurrency(spent)}</span>
                      <span>Budget: {formatCurrency(budget.amount)}</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                      // @ts-ignore
                      style={{ '--progress-background': isOverBudget ? '#EF4444' : '#10B981' }}
                    />
                    <div className="flex justify-between items-center">
                      <Badge variant={isOverBudget ? 'destructive' : 'default'}>
                        {isOverBudget ? 'Over Budget' : 'On Track'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {isOverBudget ? 'Overspent by' : 'Remaining'}: {formatCurrency(Math.abs(remaining))}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};