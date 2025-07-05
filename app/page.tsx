'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionForm } from '@/components/forms/transaction-form';
import { BudgetForm } from '@/components/forms/budget-form';
import { TransactionList } from '@/components/lists/transaction-list';
import { BudgetList } from '@/components/lists/budget-list';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { SpendingInsights } from '@/components/dashboard/spending-insights';
import { MonthlyExpensesChart } from '@/components/charts/monthly-expenses-chart';
import { CategoryPieChart } from '@/components/charts/category-pie-chart';
import { BudgetComparisonChart } from '@/components/charts/budget-comparison-chart';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingCard } from '@/components/ui/loading-spinner';
import { useTransactions } from '@/hooks/use-transactions';
import { useBudgets } from '@/hooks/use-budgets';
import { Transaction, Budget } from '@/lib/types';

export default function Home() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, isLoading: transactionsLoading, error: transactionsError } = useTransactions();
  const { budgets, addBudget, updateBudget, deleteBudget, isLoading: budgetsLoading, error: budgetsError } = useBudgets();
  
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBudget, setBudget] = useState<Budget | undefined>(undefined);

  const handleAddTransaction = async (data: any) => {
    try {
      await addTransaction(data);
      setShowTransactionForm(false);
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const handleUpdateTransaction = async (data: any) => {
    if (editingTransaction) {
      try {
        await updateTransaction(editingTransaction.id, data);
        setEditingTransaction(null);
      } catch (error) {
        console.error('Failed to update transaction:', error);
      }
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const handleAddBudget = async (data: any) => {
    try {
      await addBudget(data);
      setShowBudgetForm(false);
    } catch (error) {
      console.error('Failed to add budget:', error);
    }
  };

  const handleUpdateBudget = async (data: any) => {
    if (editingBudget) {
      try {
        await updateBudget(editingBudget.id, data);
        setBudget(undefined);
        setShowBudgetForm(false);
      } catch (error) {
        console.error('Failed to update budget:', error);
      }
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setBudget(budget);
    setShowBudgetForm(true);
  };

  const handleDeleteBudget = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
      } catch (error) {
        console.error('Failed to delete budget:', error);
      }
    }
  };

  if (transactionsLoading || budgetsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingCard message="Loading your financial data..." />
        </div>
      </div>
    );
  }

  if (transactionsError || budgetsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error Loading Data</h2>
            <p className="text-red-600 mt-1">
              {transactionsError || budgetsError}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-3"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Personal Finance Dashboard</h1>
                <p className="text-gray-600 mt-1">Track your income, expenses, and budgets</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={showTransactionForm} onOpenChange={setShowTransactionForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Transaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <TransactionForm
                      onSubmit={handleAddTransaction}
                      onCancel={() => setShowTransactionForm(false)}
                    />
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showBudgetForm} onOpenChange={setShowBudgetForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Budget
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>{editingBudget ? 'Edit Budget' : 'Add New Budget'}</DialogTitle>
                    <BudgetForm
                      budget={editingBudget}
                      onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
                      onCancel={() => {
                        setShowBudgetForm(false);
                        setBudget(undefined);
                      }}
                      existingBudgets={budgets}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="budgets">Budgets</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <SummaryCards transactions={transactions} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
                    <MonthlyExpensesChart transactions={transactions} />
                  </div>
                  
                  <SpendingInsights transactions={transactions} />
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
                    <CategoryPieChart transactions={transactions} type="expense" />
                  </div>
                  
                  <TransactionList
                    transactions={transactions.slice(-5)}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <TransactionList
                transactions={transactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </TabsContent>

            <TabsContent value="budgets" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetList
                  budgets={budgets}
                  transactions={transactions}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Budget vs Actual</h3>
                  <BudgetComparisonChart transactions={transactions} budgets={budgets} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
                  <MonthlyExpensesChart transactions={transactions} />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
                  <CategoryPieChart transactions={transactions} type="expense" />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Income Categories</h3>
                  <CategoryPieChart transactions={transactions} type="income" />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Budget Comparison</h3>
                  <BudgetComparisonChart transactions={transactions} budgets={budgets} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit Transaction Dialog */}
          <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
            <DialogContent>
              <DialogTitle>Edit Transaction</DialogTitle>
              {editingTransaction && (
                <TransactionForm
                  transaction={editingTransaction}
                  onSubmit={handleUpdateTransaction}
                  onCancel={() => setEditingTransaction(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ErrorBoundary>
  );
}