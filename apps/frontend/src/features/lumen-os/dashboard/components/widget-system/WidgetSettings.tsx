import { useEffect, useState } from 'react'
import type { WidgetConfig } from '../../types'
import { getWidgetMetadata } from '../../services'

interface WidgetSettingsProps {
  widget: WidgetConfig
  isOpen: boolean
  onClose: () => void
  onSave: (settings: Record<string, any>) => void
}

// Shared control styling — ONE brass focus ring for every input, select and
// checkbox (see DESIGN-SYSTEM.md §2/§5/§6). No per-widget focus colors.
const inputClass =
  'w-full rounded-control border border-hairline bg-surface-sunken px-3 py-2 text-primary transition-colors placeholder:text-tertiary focus-visible:border-brass-500/50 focus-visible:outline-none focus-visible:shadow-focus'
const labelClass = 'mb-2 block text-sm font-medium text-secondary'
const helpClass = 'mt-1 text-xs text-tertiary'
const checkboxClass =
  'h-4 w-4 shrink-0 rounded-control accent-brass-500 focus-visible:outline-none focus-visible:shadow-focus'
const checkboxLabelClass = 'ml-2 text-sm text-secondary'

export default function WidgetSettings({ widget, isOpen, onClose, onSave }: WidgetSettingsProps) {
  const metadata = getWidgetMetadata(widget.type)
  const [settings, setSettings] = useState<Record<string, any>>(widget.settings || {})
  const [data, setData] = useState<Record<string, any>>(widget.data || {})
  const titleId = `widget-settings-title-${widget.id}`

  // Close on Escape while the modal is open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  const handleSaveWithData = () => {
    // For pomodoro, we need to update both settings and data
    if (widget.type === 'pomodoro') {
      onSave({ ...settings, data })
    } else {
      onSave(settings)
    }
    onClose()
  }

  // Widget-specific settings based on type
  const renderSettings = () => {
    switch (widget.type) {
      case 'notes':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="maxNotes" className={labelClass}>
                Max Notes to Display
              </label>
              <input
                id="maxNotes"
                type="number"
                value={settings.maxNotes || 10}
                onChange={(e) => setSettings({ ...settings, maxNotes: parseInt(e.target.value) })}
                className={inputClass}
                min="1"
                max="50"
                aria-label="Max Notes to Display"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTimestamps"
                checked={settings.showTimestamps !== false}
                onChange={(e) => setSettings({ ...settings, showTimestamps: e.target.checked })}
                className={checkboxClass}
              />
              <label htmlFor="showTimestamps" className={checkboxLabelClass}>
                Show timestamps
              </label>
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="timeRange" className={labelClass}>
                Time Range
              </label>
              <select
                id="timeRange"
                value={settings.timeRange || 'week'}
                onChange={(e) => setSettings({ ...settings, timeRange: e.target.value })}
                className={inputClass}
                aria-label="Time Range"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showGoals"
                checked={settings.showGoals !== false}
                onChange={(e) => setSettings({ ...settings, showGoals: e.target.checked })}
                className={checkboxClass}
              />
              <label htmlFor="showGoals" className={checkboxLabelClass}>
                Display study goals
              </label>
            </div>
          </div>
        )

      case 'progress':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="dailyGoal" className={labelClass}>
                Daily Goal (minutes)
              </label>
              <input
                id="dailyGoal"
                type="number"
                value={settings.dailyGoal || 60}
                onChange={(e) => setSettings({ ...settings, dailyGoal: parseInt(e.target.value) })}
                className={inputClass}
                min="5"
                max="480"
                step="5"
                aria-label="Daily Goal in minutes"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="celebrateStreaks"
                checked={settings.celebrateStreaks !== false}
                onChange={(e) => setSettings({ ...settings, celebrateStreaks: e.target.checked })}
                className={checkboxClass}
              />
              <label htmlFor="celebrateStreaks" className={checkboxLabelClass}>
                Celebrate milestone streaks
              </label>
            </div>
          </div>
        )

      case 'flashcards':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="cardsPerSession" className={labelClass}>
                Cards per Session
              </label>
              <input
                id="cardsPerSession"
                type="number"
                value={settings.cardsPerSession || 20}
                onChange={(e) => setSettings({ ...settings, cardsPerSession: parseInt(e.target.value) })}
                className={inputClass}
                min="5"
                max="100"
                step="5"
                aria-label="Cards per Session"
              />
            </div>
            <div>
              <label htmlFor="algorithm" className={labelClass}>
                Review Algorithm
              </label>
              <select
                id="algorithm"
                value={settings.algorithm || 'spaced'}
                onChange={(e) => setSettings({ ...settings, algorithm: e.target.value })}
                className={inputClass}
                aria-label="Review Algorithm"
              >
                <option value="random">Random</option>
                <option value="spaced">Spaced Repetition</option>
                <option value="difficult">Difficult First</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoFlip"
                checked={settings.autoFlip === true}
                onChange={(e) => setSettings({ ...settings, autoFlip: e.target.checked })}
                className={checkboxClass}
              />
              <label htmlFor="autoFlip" className={checkboxLabelClass}>
                Auto-flip cards after 3 seconds
              </label>
            </div>
          </div>
        )

      case 'quick-access':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="maxLinks" className={labelClass}>
                Number of Quick Links
              </label>
              <input
                id="maxLinks"
                type="number"
                value={settings.maxLinks || 6}
                onChange={(e) => setSettings({ ...settings, maxLinks: parseInt(e.target.value) })}
                className={inputClass}
                min="3"
                max="12"
                aria-label="Number of Quick Links"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showIcons"
                checked={settings.showIcons !== false}
                onChange={(e) => setSettings({ ...settings, showIcons: e.target.checked })}
                className={checkboxClass}
              />
              <label htmlFor="showIcons" className={checkboxLabelClass}>
                Show link icons
              </label>
            </div>
          </div>
        )

      case 'calendar':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="defaultView" className={labelClass}>
                Default View
              </label>
              <select
                id="defaultView"
                value={settings.defaultView || 'month'}
                onChange={(e) => setSettings({ ...settings, defaultView: e.target.value })}
                className={inputClass}
                aria-label="Default View"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showWeekends"
                checked={settings.showWeekends !== false}
                onChange={(e) => setSettings({ ...settings, showWeekends: e.target.checked })}
                className={checkboxClass}
              />
              <label htmlFor="showWeekends" className={checkboxLabelClass}>
                Show weekends
              </label>
            </div>
          </div>
        )

      case 'pomodoro':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="workDuration" className={labelClass}>
                Focus Duration (minutes)
              </label>
              <input
                id="workDuration"
                type="number"
                min="1"
                max="120"
                value={data.workDuration || 25}
                onChange={(e) => setData({ ...data, workDuration: parseInt(e.target.value) || 1 })}
                className={inputClass}
                aria-label="Focus Duration"
              />
              <p className={helpClass}>How long each focus session lasts</p>
            </div>

            <div>
              <label htmlFor="shortBreakDuration" className={labelClass}>
                Short Break (minutes)
              </label>
              <input
                id="shortBreakDuration"
                type="number"
                min="1"
                max="30"
                value={data.shortBreakDuration || 5}
                onChange={(e) => setData({ ...data, shortBreakDuration: parseInt(e.target.value) || 1 })}
                className={inputClass}
                aria-label="Short Break Duration"
              />
              <p className={helpClass}>Break after each focus session</p>
            </div>

            <div>
              <label htmlFor="longBreakDuration" className={labelClass}>
                Long Break (minutes)
              </label>
              <input
                id="longBreakDuration"
                type="number"
                min="1"
                max="60"
                value={data.longBreakDuration || 15}
                onChange={(e) => setData({ ...data, longBreakDuration: parseInt(e.target.value) || 1 })}
                className={inputClass}
                aria-label="Long Break Duration"
              />
              <p className={helpClass}>Break after completing all focus blocks</p>
            </div>

            <div>
              <label htmlFor="blocksBeforeLongBreak" className={labelClass}>
                Focus Blocks Before Long Break
              </label>
              <input
                id="blocksBeforeLongBreak"
                type="number"
                min="1"
                max="10"
                value={data.blocksBeforeLongBreak || 4}
                onChange={(e) => setData({ ...data, blocksBeforeLongBreak: parseInt(e.target.value) || 4 })}
                className={inputClass}
                aria-label="Blocks Before Long Break"
              />
              <p className={helpClass}>Number of focus sessions before taking a long break (default: 4)</p>
            </div>
          </div>
        )

      case 'tasks':
      case 'goals':
        return (
          <div className="py-8 text-center">
            <svg className="mx-auto mb-3 h-12 w-12 text-brass-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <p className="text-sm text-secondary">Widget settings are configured within the widget</p>
            <p className="mt-1 text-xs text-tertiary">Use the controls in the widget itself</p>
          </div>
        )

      default:
        return (
          <div className="py-8 text-center text-secondary">
            <p>No settings available for this widget</p>
          </div>
        )
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-surface-base/80 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-card border border-hairline bg-surface-overlay shadow-soft-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header — flat warm surface; the ONE sanctioned gradient lives on the icon chip only. */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-hairline p-gutter">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-gradient-to-br ${metadata.gradient} shadow-soft-sm`}>
              <svg className="h-5 w-5 text-ivory-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={metadata.icon} />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 id={titleId} className="truncate text-xl text-primary">
                {metadata.name} Settings
              </h2>
              <p className="text-xs text-tertiary">Customize your widget</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-control p-2 text-secondary transition-colors hover:bg-brass-500/10 hover:text-primary focus-visible:outline-none focus-visible:shadow-focus"
            aria-label="Close settings"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-gutter">{renderSettings()}</div>

        {/* Footer */}
        <div className="flex shrink-0 gap-3 border-t border-hairline p-gutter">
          <button
            onClick={onClose}
            className="flex-1 rounded-control border border-hairline bg-transparent px-4 py-2 font-medium text-secondary transition-colors hover:border-brass-700/60 hover:text-primary focus-visible:outline-none focus-visible:shadow-focus"
          >
            Cancel
          </button>
          <button
            onClick={widget.type === 'pomodoro' ? handleSaveWithData : handleSave}
            className="flex-1 rounded-control bg-brass-500 px-4 py-2 font-medium text-surface-base shadow-soft-sm transition-colors hover:bg-brass-600 focus-visible:outline-none focus-visible:shadow-focus"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
