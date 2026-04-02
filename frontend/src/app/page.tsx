import Link from 'next/link';
import { CheckSquare, ListTodo, Shield, Zap, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: ListTodo,
    title: 'Task Management',
    description: 'Create, edit, and organize tasks with priorities, due dates, and status tracking.',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'JWT authentication with encrypted passwords and automatic token rotation.',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Optimistic updates, loading skeletons, and toast notifications for every action.',
  },
  {
    icon: BarChart3,
    title: 'Smart Dashboard',
    description: 'Filter by status, search by title, and paginate through your tasks effortlessly.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <nav className="relative max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-7 w-7" />
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-brand-100 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/auth/register" className="text-sm font-medium bg-white text-brand-700 hover:bg-brand-50 px-4 py-2 rounded-xl transition-colors">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Organize your work,
              <br />
              <span className="text-brand-200">get things done.</span>
            </h1>
            <p className="mt-6 text-lg text-brand-100 max-w-lg leading-relaxed">
              A clean, fast task management system. Create tasks, track progress, and stay on top of your workflow.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                Start for Free
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all">
                I have an account
              </Link>
            </div>
          </div>

          {/* Floating UI preview hint */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 space-y-3">
              {[
                { status: 'Completed', title: 'Set up project structure', color: 'bg-green-400' },
                { status: 'In Progress', title: 'Build authentication system', color: 'bg-blue-400' },
                { status: 'Pending', title: 'Design task dashboard', color: 'bg-amber-400' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <div className={`h-3 w-3 rounded-full ${item.color} flex-shrink-0`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-brand-200">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-surface-900">Everything you need to stay organized</h2>
          <p className="text-surface-500 mt-3 max-w-md mx-auto">
            Built with modern tools and best practices for a seamless experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="group p-6 rounded-2xl border border-surface-200 hover:border-brand-200 hover:shadow-lg transition-all duration-300">
              <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                <Icon className="h-5 w-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-surface-900 mb-2">{title}</h3>
              <p className="text-sm text-surface-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to get organized?</h2>
          <p className="text-surface-400 mt-3 max-w-md mx-auto">
            Create your free account and start managing tasks in under a minute.
          </p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 mt-8 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-surface-50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-surface-500">
            <CheckSquare className="h-4 w-4" />
            <span className="text-sm font-medium">TaskFlow</span>
          </div>
          <p className="text-xs text-surface-400">
            Built with Next.js, Express, and PostgreSQL
          </p>
        </div>
      </footer>
    </main>
  );
}
