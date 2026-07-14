import type { TaskInput } from '../types'

// Relative dates are computed at call time so the demo always looks fresh
// (one overdue, some upcoming). Kept as a function to avoid stale constants.
export function sampleTasks(): TaskInput[] {
  const day = 86_400_000
  const now = Date.now()
  const iso = (offsetDays: number) =>
    new Date(now + offsetDays * day).toISOString().slice(0, 10)

  return [
    {
      title: 'Design new landing page',
      description: 'Hero, features grid, pricing, and footer.',
      status: 'backlog',
      priority: 'high',
      due_date: iso(5),
      assignee: 'Maya Cohen',
    },
    {
      title: 'Set up CI pipeline',
      description: 'Run lint + Playwright on every push.',
      status: 'backlog',
      priority: 'medium',
      due_date: iso(9),
      assignee: 'Daniel Levi',
    },
    {
      title: 'Fix login redirect bug',
      description: 'Users land on /login after refresh sometimes.',
      status: 'in_progress',
      priority: 'urgent',
      due_date: iso(-1),
      assignee: 'Noa Bar',
    },
    {
      title: 'Write API documentation',
      description: 'Cover auth and tasks endpoints.',
      status: 'in_progress',
      priority: 'low',
      due_date: iso(12),
      assignee: 'Daniel Levi',
    },
    {
      title: 'User research interviews',
      description: 'Talk to 5 pilot customers.',
      status: 'done',
      priority: 'medium',
      due_date: iso(-4),
      assignee: 'Maya Cohen',
    },
    {
      title: 'Onboarding email sequence',
      description: 'Three-part welcome flow.',
      status: 'done',
      priority: 'low',
      due_date: iso(-7),
      assignee: 'Noa Bar',
    },
  ]
}
