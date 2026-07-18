import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/roster', label: 'Roster' },
  { to: '/rankings', label: 'Rankings' },
  { to: '/events', label: 'Events' },
  { to: '/titles', label: 'Title History' },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <aside className="fixed inset-y-0 left-0 w-56 border-r border-neutral-800 bg-neutral-950/95 flex flex-col">
        <div className="px-5 py-6 border-b border-neutral-800">
          <p className="text-xs tracking-[0.3em] text-red-500 font-semibold">PRESIDENT MODE</p>
          <p className="text-lg font-bold tracking-tight">Fight Universe</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-600/15 text-red-400 border border-red-600/30'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-neutral-800 text-[11px] text-neutral-600">
          All data is saved locally in this browser.
        </div>
      </aside>
      <main className="ml-56 flex-1 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
