import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'
import { CATEGORY_COLORS } from '../../constants/config'
import '@/styles/dashboard.css'

interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  deadline?: string
  category: 'daily' | 'weekly' | 'monthly' | 'custom'
  createdAt: number
  completedAt?: number
}

export default function GoalsWidget({ config, onUpdate }: WidgetProps) {
  const [goals, setGoals] = useState<Goal[]>(config.data?.goals || [])
  const [isAdding, setIsAdding] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 10,
    unit: 'hours',
    category: 'weekly' as Goal['category']
  })
  const progressBarRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const onUpdateRef = useRef(onUpdate)

  // Keep ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (JSON.stringify(goals) !== JSON.stringify(config.data?.goals)) {
      onUpdateRef.current({ data: { ...config.data, goals } })
    }
  }, [goals, config.data])

  // Update progress bar widths dynamically
  useEffect(() => {
    goals.forEach(goal => {
      const progressBar = progressBarRefs.current.get(goal.id)
      if (progressBar) {
        const progress = Math.min((goal.current / goal.target) * 100, 100)
        progressBar.style.width = `${progress}%`
      }
    })
  }, [goals])

  const addGoal = () => {
    if (!newGoal.title.trim()) return

    const goal: Goal = {
      id: `goal_${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      target: newGoal.target,
      current: 0,
      unit: newGoal.unit,
      category: newGoal.category,
      createdAt: Date.now()
    }

    setGoals([goal, ...goals])
    setNewGoal({
      title: '',
      description: '',
      target: 10,
      unit: 'hours',
      category: 'weekly'
    })
    setIsAdding(false)
  }

  const updateProgress = (id: string, amount: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newCurrent = Math.max(0, Math.min(goal.target, goal.current + amount))
        const isCompleted = newCurrent >= goal.target && !goal.completedAt
        return {
          ...goal,
          current: newCurrent,
          completedAt: isCompleted ? Date.now() : goal.completedAt
        }
      }
      return goal
    }))
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const activeGoals = goals.filter(g => !g.completedAt)
  const completedGoals = goals.filter(g => g.completedAt)

  return (
    <div className="flex flex-col h-full">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-brass-500/15 rounded-card border border-brass-500/30">
          <div className="text-2xl font-serif text-brass-300">{activeGoals.length}</div>
          <div className="text-xs text-secondary">Active Goals</div>
        </div>
        <div className="p-3 bg-forest-500/15 rounded-card border border-forest-500/30">
          <div className="text-2xl font-serif text-forest-300">{completedGoals.length}</div>
          <div className="text-xs text-secondary">Completed</div>
        </div>
      </div>

      {/* Add Goal Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-3 bg-brass-500/10 border border-dashed border-brass-700/50 rounded-card text-brass-300 font-medium hover:bg-brass-500/15 hover:border-brass-600/60 transition-colors mb-3 focus-visible:outline-none focus-visible:shadow-focus"
        >
          + Set New Goal
        </button>
      )}

      {/* Add Goal Form */}
      {isAdding && (
        <div className="mb-3 p-4 bg-surface-overlay rounded-card border border-hairline">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Goal title..."
            aria-label="Goal title"
            className="w-full px-3 py-2 bg-surface-sunken border border-hairline rounded-control mb-2 text-sm text-primary placeholder:text-tertiary focus-visible:outline-none focus-visible:shadow-focus"
            autoFocus
          />
          <textarea
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            placeholder="Description (optional)..."
            aria-label="Goal description"
            className="w-full px-3 py-2 bg-surface-sunken border border-hairline rounded-control mb-2 text-sm text-primary placeholder:text-tertiary resize-none focus-visible:outline-none focus-visible:shadow-focus"
            rows={2}
          />
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
              aria-label="Target value"
              className="px-3 py-2 bg-surface-sunken border border-hairline rounded-control text-sm text-primary focus-visible:outline-none focus-visible:shadow-focus"
              min="1"
            />
            <input
              type="text"
              value={newGoal.unit}
              onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
              placeholder="hours"
              aria-label="Unit of measurement"
              className="px-3 py-2 bg-surface-sunken border border-hairline rounded-control text-sm text-primary placeholder:text-tertiary focus-visible:outline-none focus-visible:shadow-focus"
            />
            <select
              value={newGoal.category}
              onChange={(e) => {
                const value = e.target.value
                if (value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'custom') {
                  setNewGoal({ ...newGoal, category: value })
                }
              }}
              aria-label="Goal category"
              className="px-3 py-2 bg-surface-sunken border border-hairline rounded-control text-sm text-primary focus-visible:outline-none focus-visible:shadow-focus"
            >
              <option value="daily" className="bg-surface-overlay text-primary">Daily</option>
              <option value="weekly" className="bg-surface-overlay text-primary">Weekly</option>
              <option value="monthly" className="bg-surface-overlay text-primary">Monthly</option>
              <option value="custom" className="bg-surface-overlay text-primary">Custom</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addGoal}
              className="flex-1 px-3 py-2 bg-brass-500 hover:bg-brass-600 text-surface-base rounded-control shadow-soft-sm transition-colors text-sm font-medium focus-visible:outline-none focus-visible:shadow-focus"
            >
              Add Goal
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 px-3 py-2 bg-transparent border border-hairline text-secondary rounded-control hover:text-primary hover:border-brass-700/60 transition-colors text-sm focus-visible:outline-none focus-visible:shadow-focus"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-tertiary">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            <p className="text-sm">Any goals?</p>
            <p className="text-xs">Click above to set your first goal</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            const isCompleted = goal.completedAt !== undefined
            const cat = CATEGORY_COLORS[goal.category]

            return (
              <div
                key={goal.id}
                className={`group p-4 rounded-card border transition-colors ${
                  isCompleted
                    ? 'bg-forest-500/10 border-forest-500/30'
                    : 'bg-surface-overlay border-hairline hover:shadow-soft'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${isCompleted ? 'text-forest-300' : 'text-primary'}`}>
                      {goal.title}
                      {isCompleted && (
                        <svg className="inline w-4 h-4 ml-1 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h4>
                    {goal.description && (
                      <p className="text-xs text-tertiary mt-1">{goal.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-burgundy-300 hover:bg-burgundy-500/15 rounded-control transition-colors focus-visible:outline-none focus-visible:shadow-focus"
                    title="Delete goal"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <span className={`inline-block text-xs px-2 py-1 rounded-control border border-hairline font-medium mb-2 ${cat.bg} ${cat.text}`}>
                  {goal.category}
                </span>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-secondary mb-1">
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-surface-sunken rounded-full overflow-hidden">
                    <div
                      ref={(el) => {
                        if (el) progressBarRefs.current.set(goal.id, el)
                      }}
                      className={`goal-progress-bar h-full bg-gradient-to-r ${cat.progress}`}
                      data-progress={Math.min(progress, 100)}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                {!isCompleted && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProgress(goal.id, -1)}
                      className="flex-1 py-2 bg-transparent border border-hairline text-secondary rounded-control text-xs font-medium hover:text-primary hover:border-brass-700/60 transition-colors focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-50"
                      disabled={goal.current === 0}
                    >
                      -1
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 1)}
                      className="flex-1 py-2 bg-brass-500 hover:bg-brass-600 text-surface-base rounded-control text-xs font-medium shadow-soft-sm transition-colors focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-50"
                      disabled={goal.current >= goal.target}
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 5)}
                      className="flex-1 py-2 bg-forest-600 hover:bg-forest-700 text-ivory-100 rounded-control text-xs font-medium shadow-soft-sm transition-colors focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-50"
                      disabled={goal.current >= goal.target}
                    >
                      +5
                    </button>
                  </div>
                )}

                {isCompleted && goal.completedAt && (
                  <div className="text-xs text-forest-300 font-medium text-center py-1">
                    Completed {new Date(goal.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
