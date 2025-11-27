import React from 'react';
import { useToast } from '../../hooks/use-toast';

export const Toaster = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className="bg-card border border-primary/20 text-card-foreground p-4 rounded-lg shadow-lg min-w-[300px] animate-fade-in-left backdrop-blur-md"
        >
          {t.title && <div className="font-semibold mb-1">{t.title}</div>}
          {t.description && <div className="text-sm text-muted-foreground">{t.description}</div>}
        </div>
      ))}
    </div>
  );
};