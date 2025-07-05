'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Budget } from '@/lib/types';
import { defaultCategories, formatCurrency, getCurrentMonth } from '@/lib/data';

interface BudgetComparisonChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const BudgetComparisonChart = ({ transactions, budgets }: BudgetComparisonChartProps) => {
  const currentMonth = getCurrentMonth();
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

  const chartData = currentMonthBudgets.map(budget => {
    const category = defaultCategories.find(c => c.id === budget.categoryId);
    const spent = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.categoryId &&
        t.date.startsWith(currentMonth)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: category?.name || 'Unknown',
      budget: budget.amount,
      spent: spent,
      remaining: Math.max(0, budget.amount - spent),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Budget: {formatCurrency(payload[0]?.value || 0)}
          </p>
          <p className="text-red-600">
            Spent: {formatCurrency(payload[1]?.value || 0)}
          </p>
          <p className="text-green-600">
            Remaining: {formatCurrency(payload[2]?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
        No budget data available for this month
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="category" 
            tick={{ fontSize: 12 }}
            stroke="#666"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#666"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
          <Bar dataKey="spent" fill="#EF4444" name="Spent" />
          <Bar dataKey="remaining" fill="#10B981" name="Remaining" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};