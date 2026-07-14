import { useMemo, useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import type { Priority, Task, TaskInput } from '../types'
import { STATUSES } from '../types'
import Column from '../components/Board/Column'
import TaskModal from '../components/Board/TaskModal'
import Toolbar from '../components/Toolbar'

export default function Board() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')

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
