import type { Task } from '../../types'
import PriorityBadge from './PriorityBadge'
import Avatar from '../Avatar'

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
  const statusLabel = task.status.replace('_', ' ')

  return (
    <div
      data-testid="task-card"
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      aria-label={`${task.title}. ${task.priority} priority, in ${statusLabel} column. Press Enter to edit.`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`group cursor-grab rounded-lg border border-l-4 border-monday-border bg-white p-3 shadow-card transition hover:shadow-modal focus:outline-none focus-visible:ring-2 focus-visible:ring-monday-purple active:cursor-grabbing ${priorityBorder[task.priority]}`}
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
        {task.assignee && <Avatar name={task.assignee} size={24} className="ml-auto" />}
      </div>
    </div>
  )
}
