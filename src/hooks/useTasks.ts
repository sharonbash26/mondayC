import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Task, TaskInput } from '../types'
import { useAuth } from '../context/AuthProvider'

export function useTasks() {
  const { session } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!session) return
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setTasks(data as Task[])
    setLoading(false)
  }, [session])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addTask = async (input: TaskInput) => {
    if (!session) return { error: 'Not authenticated' }
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...input, user_id: session.user.id })
      .select()
      .single()
    if (error) return { error: error.message }
    setTasks((prev) => [data as Task, ...prev])
    return { error: null }
  }

  const updateTask = async (id: string, input: Partial<TaskInput>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(input)
      .eq('id', id)
      .select()
      .single()
    if (error) return { error: error.message }
    setTasks((prev) => prev.map((t) => (t.id === id ? (data as Task) : t)))
    return { error: null }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) return { error: error.message }
    setTasks((prev) => prev.filter((t) => t.id !== id))
    return { error: null }
  }

  return { tasks, loading, error, addTask, updateTask, deleteTask, refresh }
}
