'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { Eye, EyeOff, Mail, Lock, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login({ email, password });
      toast.success('Welcome back!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 items-center justify-center p-12">
        <div className="max-w-md text-white space-y-6">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-10 w-10" />
            <h1 className="text-4xl font-bold">TaskFlow</h1>
          </div>
          <p className="text-brand-100 text-lg leading-relaxed">
            Stay organized, stay productive. Manage your tasks with clarity and focus.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">Fast</div>
              <div className="text-brand-200 text-sm">Create tasks in seconds</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">Secure</div>
              <div className="text-brand-200 text-sm">Your data is protected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
            <CheckSquare className="h-7 w-7 text-brand-600" />
            <span className="text-2xl font-bold text-surface-900">
              Task<span className="text-brand-600">Flow</span>
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-surface-900">Welcome back</h2>
            <p className="text-surface-500 mt-2">Sign in to continue managing your tasks</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-surface-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-surface-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Spinner size="sm" className="border-white/30 border-t-white" /> : null}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-brand-600 hover:text-brand-700 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
