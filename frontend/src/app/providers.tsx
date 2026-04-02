'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/hooks/useAuth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#212529',
            color: '#f8f9fa',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#5c7cfa', secondary: '#fff' },
          },
        }}
      />
    </AuthProvider>
  );
}
