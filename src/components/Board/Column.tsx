import { useState } from 'react'
import type { Status, Task } from '../../types'
import TaskCard from './TaskCard'

const headerStyles: Record<Status, string> = {
  backlog: 'bg-status-backlog text-monday-text',
  in_progress: 'bg-status-progress text-white',
  done: 'bg-status-done text-white',
}

export default function Column({
  status,
  label,
  tasks,
  onAdd,
  onTaskClick,
  onTaskDelete,
  onDropTask,
}: {
  status: Status
  label: string
  tasks: Task[]
  onAdd: () => void
  onTaskClick: (task: Task) => void
  onTaskDelete: (task: Task) => void
  onDropTask?: (taskId: string, status: Status) => void
}) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div
      data-testid={`column-${status}`}
      onDragOver={(e) => {
        if (!onDropTask) return
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (!onDropTask) return
        e.preventDefault()
        setDragOver(false)
        const id = e.dataTransfer.getData('text/plain')
        if (id) onDropTask(id, status)
      }}
      className={`flex w-full min-w-0 flex-col rounded-xl bg-white/60 transition md:w-80 md:shrink-0 ${
        dragOver ? 'ring-2 ring-monday-purple ring-offset-2' : ''
      }`}
    >
      <div className={`flex items-center justify-between rounded-t-xl px-3 py-2 ${headerStyles[status]}`}>
        <span className="text-sm font-semibold">
          {label} <span className="ml-1 opacity-80">({tasks.length})</span>
        </span>
        {status === 'backlog' && (
          <button
            data-testid="add-task"
            onClick={onAdd}
            className="rounded-md bg-black/10 px-2 py-0.5 text-sm font-bold hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-monday-purple"
            aria-label="Add task"
          >
            +
          </button>
        )}
      </div>
      <div className="flex-1 space-y-2 rounded-b-xl border border-t-0 border-monday-border bg-monday-bg/50 p-2">
        {tasks.length === 0 && (
          <p className="py-6 text-center text-xs text-monday-muted">No tasks</p>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDelete={() => onTaskDelete(task)}
          />
        ))}
      </div>
    </div>
  )
}
