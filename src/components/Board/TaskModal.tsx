import { useEffect, useState, type FormEvent } from 'react'
import type { Priority, Status, Task, TaskInput } from '../../types'
import { PRIORITIES, STATUSES } from '../../types'

const emptyForm: TaskInput = {
  title: '',
  description: '',
  status: 'backlog',
  priority: 'medium',
  due_date: '',
  assignee: '',
}

export default function TaskModal({
  task,
  onClose,
  onSave,
  onDelete,
}: {
  task: Task | null
  onClose: () => void
  onSave: (input: TaskInput) => Promise<{ error: string | null }>
  onDelete?: () => void
}) {
  const [form, setForm] = useState<TaskInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ?? '',
        assignee: task.assignee ?? '',
      })
    } else {
      setForm(emptyForm)
    }
    setError(null)
  }, [task])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    setBusy(true)
    const { error } = await onSave({
      ...form,
      description: form.description?.trim() || null,
      due_date: form.due_date || null,
      assignee: form.assignee?.trim() || null,
    })
    setBusy(false)
    if (error) setError(error)
    else onClose()
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{task ? 'Edit task' : 'New task'}</h2>
          <button onClick={onClose} className="text-monday-muted hover:text-monday-text" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              autoFocus
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Design the landing page"
              className="w-full rounded-lg border border-monday-border px-3 py-2 outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full resize-none rounded-lg border border-monday-border px-3 py-2 outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                className="w-full rounded-lg border border-monday-border px-3 py-2 outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20"
              >
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="mb-1 block text-sm font-medium">
                Priority
              </label>
              <select
                id="priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                className="w-full rounded-lg border border-monday-border px-3 py-2 outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p[0].toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="due_date" className="mb-1 block text-sm font-medium">
                Due date
              </label>
              <input
                id="due_date"
                type="date"
                value={form.due_date ?? ''}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full rounded-lg border border-monday-border px-3 py-2 outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20"
              />
            </div>

            <div>
              <label htmlFor="assignee" className="mb-1 block text-sm font-medium">
                Assignee
              </label>
              <input
                id="assignee"
                value={form.assignee ?? ''}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                placeholder="Name"
                className="w-full rounded-lg border border-monday-border px-3 py-2 outline-none focus:border-monday-purple focus:ring-2 focus:ring-monday-purple/20"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-prio-urgent/10 px-3 py-2 text-sm text-prio-urgent">{error}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            {task && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="text-sm font-medium text-prio-urgent hover:underline"
              >
                Delete task
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-monday-border px-4 py-2 text-sm font-medium hover:bg-monday-bg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-monday-purple px-4 py-2 text-sm font-medium text-white hover:bg-monday-purple/90 disabled:opacity-60"
              >
                {busy ? 'Saving…' : task ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
