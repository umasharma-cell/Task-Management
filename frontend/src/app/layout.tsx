import type { Metadata } from 'next';
import { Providers } from './providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow - Task Management',
  description: 'A modern task management system to organize your work efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
