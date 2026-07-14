import { useMemo } from 'react'
import { useTasks } from '../hooks/useTasks'
import { PRIORITIES, STATUSES } from '../types'

const statusColor: Record<string, string> = {
  backlog: 'bg-status-backlog',
  in_progress: 'bg-status-progress',
  done: 'bg-status-done',
}

const prioColor: Record<string, string> = {
  low: 'bg-prio-low',
  medium: 'bg-prio-medium',
  high: 'bg-prio-high',
  urgent: 'bg-prio-urgent',
}

function isOverdue(d: string | null) {
  if (!d) return false
  return new Date(d + 'T23:59:59') < new Date()
}

export default function Dashboard() {
  const { tasks, loading } = useTasks()

  const stats = useMemo(() => {
    const byStatus = STATUSES.map((s) => ({
      key: s.key,
      label: s.label,
      count: tasks.filter((t) => t.status === s.key).length,
    }))
    const byPriority = PRIORITIES.map((p) => ({
      key: p,
      count: tasks.filter((t) => t.priority === p).length,
    }))
    const overdue = tasks.filter((t) => t.status !== 'done' && isOverdue(t.due_date))
    const total = tasks.length
    const done = tasks.find((s) => s.status === 'done') ? tasks.filter((t) => t.status === 'done').length : 0
    const doneRate = total ? Math.round((done / total) * 100) : 0
    return { byStatus, byPriority, overdue, total, done, doneRate }
  }, [tasks])

  if (loading) {
    return <div className="p-6 text-monday-muted">Loading dashboard…</div>
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-card">
          <p className="text-xs font-medium text-monday-muted">Total tasks</p>
          <p className="mt-1 text-3xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-card">
          <p className="text-xs font-medium text-monday-muted">Completed</p>
          <p className="mt-1 text-3xl font-semibold text-status-done">{stats.doneRate}%</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-card">
          <p className="text-xs font-medium text-monday-muted">Overdue</p>
          <p className="mt-1 text-3xl font-semibold text-prio-urgent">{stats.overdue.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-card">
          <p className="text-xs font-medium text-monday-muted">In progress</p>
          <p className="mt-1 text-3xl font-semibold text-status-progress">
            {stats.byStatus.find((s) => s.key === 'in_progress')?.count ?? 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold text-monday-muted">By status</h2>
          <div className="space-y-2">
            {stats.byStatus.map((s) => (
              <div key={s.key} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${statusColor[s.key]}`} />
                <span className="flex-1 text-sm">{s.label}</span>
                <span className="text-sm font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold text-monday-muted">By priority</h2>
          <div className="space-y-2">
            {stats.byPriority.map((p) => (
              <div key={p.key} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${prioColor[p.key]}`} />
                <span className="flex-1 text-sm capitalize">{p.key}</span>
                <span className="text-sm font-semibold">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {stats.overdue.length > 0 && (
        <div className="rounded-xl bg-white p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold text-prio-urgent">Overdue tasks</h2>
          <ul className="space-y-1">
            {stats.overdue.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <span>{t.title}</span>
                <span className="text-monday-muted">{t.due_date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
