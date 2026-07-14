import type { Priority } from '../types'
import { PRIORITIES } from '../types'

export default function Toolbar({
  search,
  onSearch,
  priorityFilter,
  onPriorityFilter,
  onNewTask,
}: {
  search: string
  onSearch: (v: string) => void
  priorityFilter: Priority | 'all'
  onPriorityFilter: (v: Priority | 'all') => void
  onNewTask: () => void
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-monday-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <input
          data-testid="search-input"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tasks…"
          className="w-full rounded-lg border border-monday-border px-3 py-2 text-sm outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20 sm:max-w-xs"
        />
        <select
          data-testid="priority-filter"
          value={priorityFilter}
          onChange={(e) => onPriorityFilter(e.target.value as Priority | 'all')}
          className="rounded-lg border border-monday-border px-3 py-2 text-sm outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20"
        >
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p[0].toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <button
        data-testid="new-task-btn"
        onClick={onNewTask}
        className="rounded-lg bg-monday-purple px-4 py-2 text-sm font-medium text-white hover:bg-monday-purple/90"
      >
        + New task
      </button>
    </div>
  )
}
