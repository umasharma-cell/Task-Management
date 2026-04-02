'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, CheckSquare, User } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-surface-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-brand-600" />
            <span className="text-xl font-bold text-surface-900">
              Task<span className="text-brand-600">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-surface-600">
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                <User className="h-4 w-4 text-brand-700" />
              </div>
              <span className="font-medium">{user?.name}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-surface-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
