import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="text-center space-y-8 px-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-surface-900 tracking-tight">
            Task<span className="text-brand-600">Flow</span>
          </h1>
          <p className="text-lg text-surface-600 max-w-md mx-auto">
            Organize your tasks, streamline your workflow, and get things done.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login" className="btn-primary">
            Sign In
          </Link>
          <Link href="/auth/register" className="btn-secondary">
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
