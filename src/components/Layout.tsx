import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const nav = [
  { to: '/', label: 'Board', icon: '▦' },
  { to: '/dashboard', label: 'Dashboard', icon: '▤' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { session, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-monday-bg">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 flex h-full w-60 flex-col border-r border-monday-border bg-white transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-monday-purple font-bold text-white">
            m
          </div>
          <span className="text-lg font-semibold">mondayC</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-monday-purple/10 text-monday-purple'
                    : 'text-monday-muted hover:bg-monday-bg'
                }`
              }
            >
              <span>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-monday-border p-3">
          <p className="mb-2 truncate px-2 text-xs text-monday-muted" title={session?.user.email ?? ''}>
            {session?.user.email}
          </p>
          <button
            onClick={signOut}
            className="w-full rounded-lg border border-monday-border py-2 text-sm font-medium text-monday-text hover:bg-monday-bg"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-monday-border bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-monday-border px-3 py-1.5 text-sm"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-semibold">mondayC</span>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
