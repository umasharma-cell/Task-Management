'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, CheckSquare, User, Menu, X } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const greeting = getGreeting();

  return (
    <nav className="bg-white border-b border-surface-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-brand-600" />
            <span className="text-xl font-bold text-surface-900">
              Task<span className="text-brand-600">Flow</span>
            </span>
          </div>

          {/* Desktop right section */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-surface-900">{user?.name}</p>
                <p className="text-xs text-surface-400">{greeting}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-surface-200" />

            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-surface-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-surface-500 hover:text-surface-700 rounded-lg"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-surface-100 py-3 space-y-1 animate-in">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900">{user?.name}</p>
                <p className="text-xs text-surface-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 text-sm text-red-500 px-2 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
