import { useMemo, useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import type { Priority, Status, Task, TaskInput } from '../types'
import { STATUSES } from '../types'
import Column from '../components/Board/Column'
import TaskModal from '../components/Board/TaskModal'
import Toolbar from '../components/Toolbar'
import { sampleTasks } from '../lib/sampleTasks'

export default function Board() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [seeding, setSeeding] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks.filter((t) => {
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q) ||
        (t.assignee ?? '').toLowerCase().includes(q)
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
  }, [tasks, search, priorityFilter])

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditing(task)
    setModalOpen(true)
  }

  const handleSave = async (input: TaskInput) => {
    if (editing) return updateTask(editing.id, input)
    return addTask(input)
  }

  const handleDelete = async (task: Task) => {
    await deleteTask(task.id)
    if (editing?.id === task.id) setModalOpen(false)
  }

  const handleDropTask = (taskId: string, status: Status) => {
    const t = tasks.find((x) => x.id === taskId)
    if (t && t.status !== status) updateTask(taskId, { status })
  }

  const loadSamples = async () => {
    setSeeding(true)
    for (const t of sampleTasks()) {
      await addTask(t)
    }
    setSeeding(false)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-semibold">My Board</h1>
      </div>
      <Toolbar
        search={search}
        onSearch={setSearch}
        priorityFilter={priorityFilter}
        onPriorityFilter={setPriorityFilter}
        onNewTask={openNew}
      />

      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <p className="text-monday-muted">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-monday-border bg-white/60 p-8 text-center">
            <h2 className="text-lg font-semibold">Your board is empty</h2>
            <p className="mt-1 text-sm text-monday-muted">
              Add your first task, or load some sample data to explore.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={openNew}
                className="rounded-lg bg-monday-purple px-4 py-2 text-sm font-medium text-white hover:bg-monday-purple/90"
              >
                + New task
              </button>
              <button
                data-testid="load-samples"
                onClick={loadSamples}
                disabled={seeding}
                className="rounded-lg border border-monday-border px-4 py-2 text-sm font-medium hover:bg-monday-bg disabled:opacity-60"
              >
                {seeding ? 'Loading…' : 'Load sample data'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            {STATUSES.map((s) => (
              <Column
                key={s.key}
                status={s.key}
                label={s.label}
                tasks={filtered.filter((t) => t.status === s.key)}
                onAdd={openNew}
                onTaskClick={openEdit}
                onTaskDelete={handleDelete}
                onDropTask={handleDropTask}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <TaskModal
          task={editing}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={editing ? () => handleDelete(editing) : undefined}
        />
      )}
    </div>
  )
}
