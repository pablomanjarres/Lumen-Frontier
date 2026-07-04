import { useState } from 'react'
import type { WidgetProps } from '../../types'

interface DailyStats {
  date: string
  focusTime: number // in minutes
  tasksCompleted: number
  journalEntries: number
  pomodoroSessions: number
}

interface WeeklyGoal {
  id: string
  name: string
  target: number
  current: number
  unit: string
  color: string
}

export default function StatsWidget({ config }: WidgetProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [selectedMetric, setSelectedMetric] = useState<'focus' | 'tasks' | 'journal' | 'pomodoro'>('focus')

  // Mock data - in a real app, this would come from the dashboard's data
  const dailyStats: DailyStats[] = [
    { date: '2025-10-20', focusTime: 120, tasksCompleted: 5, journalEntries: 1, pomodoroSessions: 4 },
    { date: '2025-10-21', focusTime: 180, tasksCompleted: 7, journalEntries: 1, pomodoroSessions: 6 },
    { date: '2025-10-22', focusTime: 90, tasksCompleted: 3, journalEntries: 0, pomodoroSessions: 3 },
    { date: '2025-10-23', focusTime: 150, tasksCompleted: 6, journalEntries: 1, pomodoroSessions: 5 },
    { date: '2025-10-24', focusTime: 200, tasksCompleted: 8, journalEntries: 1, pomodoroSessions: 7 },
    { date: '2025-10-25', focusTime: 110, tasksCompleted: 4, journalEntries: 1, pomodoroSessions: 4 },
    { date: '2025-10-26', focusTime: 160, tasksCompleted: 6, journalEntries: 1, pomodoroSessions: 5 }
  ]

  const weeklyGoals: WeeklyGoal[] = [
    { id: '1', name: 'Focus Hours', target: 20, current: 17.1, unit: 'hrs', color: 'brass' },
    { id: '2', name: 'Tasks Done', target: 40, current: 39, unit: 'tasks', color: 'cognac' },
    { id: '3', name: 'Journal Days', target: 7, current: 6, unit: 'days', color: 'burgundy' },
    { id: '4', name: 'Pomodoros', target: 30, current: 34, unit: 'sessions', color: 'forest' }
  ]

  const totalFocusTime = dailyStats.reduce((sum, day) => sum + day.focusTime, 0)
  const totalTasks = dailyStats.reduce((sum, day) => sum + day.tasksCompleted, 0)
  const totalJournal = dailyStats.reduce((sum, day) => sum + day.journalEntries, 0)
  const totalPomodoros = dailyStats.reduce((sum, day) => sum + day.pomodoroSessions, 0)

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'focus':
        return dailyStats.map(d => d.focusTime)
      case 'tasks':
        return dailyStats.map(d => d.tasksCompleted)
      case 'journal':
        return dailyStats.map(d => d.journalEntries)
      case 'pomodoro':
        return dailyStats.map(d => d.pomodoroSessions)
    }
  }

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'focus':
        return { bg: 'bg-brass-500', text: 'text-brass-300' }
      case 'tasks':
        return { bg: 'bg-cognac-500', text: 'text-cognac-300' }
      case 'journal':
        return { bg: 'bg-burgundy-500', text: 'text-burgundy-300' }
      case 'pomodoro':
        return { bg: 'bg-forest-500', text: 'text-forest-300' }
    }
  }

  const metricData = getMetricData()
  const maxValue = Math.max(...metricData, 1)
  const colors = getMetricColor()

  const getGoalColor = (color: string) => {
    switch (color) {
      case 'brass':
        return { bg: 'bg-brass-500', text: 'text-brass-300' }
      case 'cognac':
        return { bg: 'bg-cognac-500', text: 'text-cognac-300' }
      case 'burgundy':
        return { bg: 'bg-burgundy-500', text: 'text-burgundy-300' }
      case 'forest':
        return { bg: 'bg-forest-500', text: 'text-forest-300' }
      default:
        return { bg: 'bg-brass-500', text: 'text-brass-300' }
    }
  }

  // Segmented-control button: flat semantic fill when active, quiet hairline when not.
  const segmentClass = (active: boolean, activeFill: string) =>
    `flex-1 py-2 px-3 rounded-control text-xs font-medium transition-colors focus-visible:outline-none focus-visible:shadow-focus ${
      active
        ? `${activeFill} shadow-soft-sm`
        : 'bg-transparent border border-hairline text-secondary hover:text-primary hover:border-brass-700/60'
    }`

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">Productivity Stats</h3>
        <p className="text-xs text-tertiary">Your weekly performance overview</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-4">
        {(['week', 'month', 'year'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={segmentClass(selectedPeriod === period, 'bg-brass-500 text-surface-base')}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-3 bg-surface-overlay border border-hairline rounded-card">
          <p className="text-xs text-secondary mb-1">Focus Time</p>
          <p className="text-xl font-serif text-brass-200">{Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m</p>
        </div>
        <div className="p-3 bg-surface-overlay border border-hairline rounded-card">
          <p className="text-xs text-secondary mb-1">Tasks Done</p>
          <p className="text-xl font-serif text-cognac-200">{totalTasks}</p>
        </div>
        <div className="p-3 bg-surface-overlay border border-hairline rounded-card">
          <p className="text-xs text-secondary mb-1">Journal Entries</p>
          <p className="text-xl font-serif text-burgundy-200">{totalJournal}</p>
        </div>
        <div className="p-3 bg-surface-overlay border border-hairline rounded-card">
          <p className="text-xs text-secondary mb-1">Pomodoros</p>
          <p className="text-xl font-serif text-forest-200">{totalPomodoros}</p>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setSelectedMetric('focus')}
          className={segmentClass(selectedMetric === 'focus', 'bg-brass-500 text-surface-base')}
        >
          Focus
        </button>
        <button
          onClick={() => setSelectedMetric('tasks')}
          className={segmentClass(selectedMetric === 'tasks', 'bg-cognac-600 text-ivory-100')}
        >
          Tasks
        </button>
        <button
          onClick={() => setSelectedMetric('journal')}
          className={segmentClass(selectedMetric === 'journal', 'bg-burgundy-600 text-ivory-100')}
        >
          Journal
        </button>
        <button
          onClick={() => setSelectedMetric('pomodoro')}
          className={segmentClass(selectedMetric === 'pomodoro', 'bg-forest-600 text-ivory-100')}
        >
          Pomo
        </button>
      </div>

      {/* Simple Bar Chart */}
      <div className="mb-4 p-3 bg-surface-overlay border border-hairline rounded-card">
        <p className="text-xs text-secondary mb-3 font-medium">Last 7 Days</p>
        <div className="flex items-end justify-between gap-1 h-24">
          {metricData.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-surface-sunken rounded-t relative overflow-hidden flex-1 flex flex-col justify-end">
                <div
                  className={`w-full ${colors.bg} rounded-t transition-all duration-500`}
                  style={{ height: `${(value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-xs text-tertiary font-medium">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-sm font-semibold text-primary mb-2 px-1">Weekly Goals</h4>
        <div className="space-y-2">
          {weeklyGoals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100)
            const goalColors = getGoalColor(goal.color)
            const isComplete = goal.current >= goal.target

            return (
              <div
                key={goal.id}
                className="p-3 bg-surface-overlay border border-hairline rounded-card hover:border-brass-700/50 hover:shadow-soft transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isComplete && (
                      <svg className="w-4 h-4 text-forest-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <p className="text-sm font-medium text-primary">{goal.name}</p>
                  </div>
                  <p className="text-xs text-tertiary">
                    <span className={`font-semibold ${goalColors.text}`}>{goal.current}</span>
                    <span> / {goal.target} {goal.unit}</span>
                  </p>
                </div>
                <div className="w-full h-2 bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className={`h-full ${goalColors.bg} transition-all duration-500 rounded-full`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary Insight */}
      <div className="mt-3 p-3 bg-brass-500/10 border border-brass-500/30 rounded-card">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-brass-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <div className="flex-1">
            <p className="text-xs text-brass-300 font-medium mb-1">Keep it up!</p>
            <p className="text-xs text-secondary">
              You're on track to meet {weeklyGoals.filter(g => g.current >= g.target).length} of {weeklyGoals.length} weekly goals.
              {totalFocusTime > 1000 && ' Outstanding focus time this week!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
