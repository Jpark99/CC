import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-neutral-800 bg-neutral-900/60 ${className}`}
      {...props}
    />
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-50">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-red-600 hover:bg-red-500 text-white',
    secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100',
    ghost: 'bg-transparent hover:bg-neutral-800 text-neutral-300',
    danger: 'bg-transparent hover:bg-red-950 text-red-500 border border-red-900',
  }[variant];
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none ${styles} ${className}`}
      {...props}
    />
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'red' | 'green' }) {
  const styles = {
    neutral: 'bg-neutral-800 text-neutral-300',
    gold: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    red: 'bg-red-600/15 text-red-400 border border-red-600/30',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  }[tone];
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${styles}`}>{children}</span>;
}

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-neutral-300 font-medium">{title}</p>
      {subtitle && <p className="text-sm text-neutral-500 max-w-sm">{subtitle}</p>}
      {action}
    </Card>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:border-red-600 focus:outline-none ${props.className ?? ''}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-red-600 focus:outline-none ${props.className ?? ''}`}
    />
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-neutral-400 mb-1">
      {children}
    </label>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-10">
      <Card className="w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-50">{title}</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-200 text-xl leading-none">
            &times;
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
}
