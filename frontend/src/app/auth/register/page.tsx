'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { Eye, EyeOff, Mail, Lock, UserIcon, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ email, name, password });
      toast.success('Account created! Welcome aboard.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
            Join thousands of people who organize their work with TaskFlow.
          </p>
          <div className="space-y-3 pt-4">
            {['Create and organize tasks effortlessly', 'Track progress with status updates', 'Filter and search through your tasks'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="h-3.5 w-3.5" />
                </div>
                <span className="text-brand-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
            <CheckSquare className="h-7 w-7 text-brand-600" />
            <span className="text-2xl font-bold text-surface-900">
              Task<span className="text-brand-600">Flow</span>
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-surface-900">Create your account</h2>
            <p className="text-surface-500 mt-2">Start managing your tasks in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-surface-700">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field pl-10"
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  className="input-field pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength indicators */}
              {password.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[
                    { label: '8+ characters', met: passwordChecks.length },
                    { label: 'Uppercase letter', met: passwordChecks.uppercase },
                    { label: 'Lowercase letter', met: passwordChecks.lowercase },
                    { label: 'Number', met: passwordChecks.number },
                  ].map(({ label, met }) => (
                    <div key={label} className={`text-xs flex items-center gap-1.5 ${met ? 'text-green-600' : 'text-surface-400'}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${met ? 'bg-green-500' : 'bg-surface-300'}`} />
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-surface-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="input-field pl-10"
                  required
                  autoComplete="new-password"
                />
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Spinner size="sm" className="border-white/30 border-t-white" /> : null}
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
