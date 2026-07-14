import type { Priority } from '../../types'

const styles: Record<Priority, string> = {
  low: 'bg-prio-low/15 text-prio-low',
  medium: 'bg-prio-medium/15 text-prio-medium',
  high: 'bg-prio-high/15 text-prio-high',
  urgent: 'bg-prio-urgent/15 text-prio-urgent',
}

const labels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  )
}
