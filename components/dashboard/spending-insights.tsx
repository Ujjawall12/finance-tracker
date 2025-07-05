'use client';

import { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { defaultCategories, formatCurrency, getCurrentMonth } from '@/lib/data';

interface SpendingInsightsProps {
  transactions: Transaction[];
}

export const SpendingInsights = ({ transactions }: SpendingInsightsProps) => {
  const currentMonth = getCurrentMonth();
  const currentMonthTransactions = transactions.filter(t => 
    t.type === 'expense' && t.date.startsWith(currentMonth)
  );

  // Top spending categories
  const categorySpending = currentMonthTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([categoryId, amount]) => ({
      category: defaultCategories.find(c => c.id === categoryId),
      amount,
    }));

  // Largest single expense
  const largestExpense = currentMonthTransactions.reduce((max, t) => 
    t.amount > max.amount ? t : max, 
    currentMonthTransactions[0] || { amount: 0, description: '', category: '' }
  );

  // Average daily spending
  const daysInMonth = new Date().getDate();
  const totalSpent = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const avgDailySpending = totalSpent / daysInMonth;

  // Spending frequency
  const transactionsByDay = currentMonthTransactions.reduce((acc, t) => {
    const day = new Date(t.date).getDate();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const avgTransactionsPerDay = Object.values(transactionsByDay).length > 0 
    ? Object.values(transactionsByDay).reduce((sum, count) => sum + count, 0) / Object.values(transactionsByDay).length
    : 0;

  const insights = [
    {
      title: 'Top Spending Categories',
      content: (
        <div className="space-y-2">
          {topCategories.map(({ category, amount }) => (
            <div key={category?.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>{category?.icon}</span>
                <span className="text-sm">{category?.name}</span>
              </div>
              <Badge variant="outline">{formatCurrency(amount)}</Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Largest Single Expense',
      content: (
        <div>
          <div className="font-medium">{largestExpense.description}</div>
          <div className="text-sm text-gray-500">
            {formatCurrency(largestExpense.amount)}
          </div>
        </div>
      ),
    },
    {
      title: 'Daily Spending Average',
      content: (
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(avgDailySpending)}
          </div>
          <div className="text-sm text-gray-500">
            {avgTransactionsPerDay.toFixed(1)} transactions/day
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h4 className="font-medium mb-2">{insight.title}</h4>
              {insight.content}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};