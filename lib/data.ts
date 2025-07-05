import { Category } from './types';

export const defaultCategories: Category[] = [
  // Expense categories
  { id: '1', name: 'Food & Dining', color: '#FF6B6B', icon: '🍕', type: 'expense' },
  { id: '2', name: 'Transportation', color: '#4ECDC4', icon: '🚗', type: 'expense' },
  { id: '3', name: 'Shopping', color: '#45B7D1', icon: '🛍️', type: 'expense' },
  { id: '4', name: 'Entertainment', color: '#96CEB4', icon: '🎬', type: 'expense' },
  { id: '5', name: 'Utilities', color: '#FFEAA7', icon: '💡', type: 'expense' },
  { id: '6', name: 'Healthcare', color: '#DDA0DD', icon: '🏥', type: 'expense' },
  { id: '7', name: 'Housing', color: '#98D8C8', icon: '🏠', type: 'expense' },
  { id: '8', name: 'Education', color: '#F7DC6F', icon: '📚', type: 'expense' },
  { id: '9', name: 'Other', color: '#BDC3C7', icon: '📊', type: 'expense' },
  
  // Income categories
  { id: '10', name: 'Salary', color: '#2ECC71', icon: '💰', type: 'income' },
  { id: '11', name: 'Freelance', color: '#3498DB', icon: '💻', type: 'income' },
  { id: '12', name: 'Investment', color: '#9B59B6', icon: '📈', type: 'income' },
  { id: '13', name: 'Other Income', color: '#1ABC9C', icon: '💵', type: 'income' },
];

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getMonthYear = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
};