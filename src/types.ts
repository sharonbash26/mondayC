export type Status = 'backlog' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  due_date: string | null
  assignee: string | null
  created_at: string
  updated_at: string
}

export type TaskInput = {
  title: string
  description?: string | null
  status: Status
  priority: Priority
  due_date?: string | null
  assignee?: string | null
}

export const STATUSES: { key: Status; label: string }[] = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent']
