'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner = ({ className, size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-gray-500',
        sizeClasses[size],
        className
      )} 
    />
  );
};

export const LoadingCard = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2">
        <LoadingSpinner />
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
};