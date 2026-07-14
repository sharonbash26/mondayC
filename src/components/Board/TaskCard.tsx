import type { Task } from '../../types'
import PriorityBadge from './PriorityBadge'

const priorityBorder: Record<Task['priority'], string> = {
  low: 'border-l-prio-low',
  medium: 'border-l-prio-medium',
  high: 'border-l-prio-high',
  urgent: 'border-l-prio-urgent',
}

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function isOverdue(d: string | null) {
  if (!d) return false
  return new Date(d + 'T23:59:59') < new Date()
}

export default function TaskCard({
  task,
  onClick,
  onDelete,
}: {
  task: Task
  onClick: () => void
  onDelete: () => void
}) {
  const due = formatDate(task.due_date)
  const overdue = task.status !== 'done' && isOverdue(task.due_date)

  return (
    <div
      data-testid="task-card"
      onClick={onClick}
      className={`group cursor-pointer rounded-lg border border-l-4 border-monday-border bg-white p-3 shadow-card transition hover:shadow-modal ${priorityBorder[task.priority]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-monday-text">{task.title}</h3>
        <button
          data-testid="delete-task"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="invisible shrink-0 rounded p-1 text-monday-muted hover:bg-prio-urgent/10 hover:text-prio-urgent group-hover:visible"
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-monday-muted">{task.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {due && (
          <span
            className={`text-xs ${overdue ? 'font-semibold text-prio-urgent' : 'text-monday-muted'}`}
          >
            📅 {due}
          </span>
        )}
        {task.assignee && (
          <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-monday-purple/10 text-[10px] font-semibold text-monday-purple">
            {task.assignee.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}
