'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/hooks/useAuth';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        gutter={10}
        containerStyle={{ top: 20, right: 20 }}
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '14px',
            background: '#212529',
            color: '#f8f9fa',
            fontSize: '13px',
            fontWeight: 500,
            padding: '12px 16px',
            maxWidth: '400px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
          success: {
            icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
            style: {
              borderLeft: '3px solid #4ade80',
            },
          },
          error: {
            duration: 5000,
            icon: <XCircle className="h-5 w-5 text-red-400" />,
            style: {
              borderLeft: '3px solid #f87171',
            },
          },
          loading: {
            icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
          },
        }}
      />
    </AuthProvider>
  );
}
