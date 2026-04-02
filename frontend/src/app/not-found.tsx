import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-brand-50 px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-bold text-brand-200">404</div>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Page not found</h1>
          <p className="text-surface-500 mt-2">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
