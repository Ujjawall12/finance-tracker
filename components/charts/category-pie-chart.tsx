'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '@/lib/types';
import { defaultCategories, formatCurrency } from '@/lib/data';

interface CategoryPieChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
}

export const CategoryPieChart = ({ transactions, type }: CategoryPieChartProps) => {
  const categoryData = transactions
    .filter(t => t.type === type)
    .reduce((acc, transaction) => {
      const category = defaultCategories.find(c => c.id === transaction.category);
      const categoryName = category?.name || 'Unknown';
      const categoryColor = category?.color || '#BDC3C7';
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
          color: categoryColor,
        };
      }
      
      acc[categoryName].value += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

  const chartData = Object.values(categoryData)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show top 8 categories

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className={type === 'income' ? 'text-green-600' : 'text-red-600'}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
        No {type} data available
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};