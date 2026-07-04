import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'

type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak'

interface PomodoroData {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  completedPomodoros: number
  totalWorkTime: number
  focusTitle?: string
  blocksBeforeLongBreak?: number
  // Persistent state
  currentMode?: PomodoroMode
  currentTimeLeft?: number
  isTimerRunning?: boolean
}

export default function PomodoroWidget({ config, onUpdate }: WidgetProps) {
  const data: PomodoroData = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    completedPomodoros: 0,
    totalWorkTime: 0,
    focusTitle: '',
    blocksBeforeLongBreak: 4,
    currentMode: 'focus',
    currentTimeLeft: undefined,
    isTimerRunning: false,
    ...(config.data as Partial<PomodoroData>)
  }

  const [mode, setMode] = useState<PomodoroMode>(data.currentMode || 'focus')
  const [timeLeft, setTimeLeft] = useState(() => {
    // Restore saved time if available, otherwise use duration
    if (data.currentTimeLeft !== undefined && data.currentTimeLeft > 0) {
      return data.currentTimeLeft
    }
    return data.workDuration * 60
  })
  const [isRunning, setIsRunning] = useState(data.isTimerRunning || false)
  const [focusTitle, setFocusTitle] = useState(data.focusTitle || '')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [showModeChangeWarning, setShowModeChangeWarning] = useState(false)
  const [pendingMode, setPendingMode] = useState<PomodoroMode | null>(null)
  const intervalRef = useRef<number | null>(null)
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  // Save state to config whenever it changes
  useEffect(() => {
    onUpdateRef.current({
      data: {
        ...data,
        currentMode: mode,
        currentTimeLeft: timeLeft,
        isTimerRunning: isRunning
      }
    })
  }, [mode, timeLeft, isRunning])

  const durations = {
    focus: data.workDuration * 60,
    shortBreak: data.shortBreakDuration * 60,
    longBreak: data.longBreakDuration * 60
  }

  // Update timeLeft when config.data changes (e.g., from settings)
  useEffect(() => {
    const newDuration = durations[mode]
    // Only update if timer is not running and we're at the start of a session
    if (!isRunning && timeLeft === durations[mode]) {
      setTimeLeft(newDuration)
    }
  }, [data.workDuration, data.shortBreakDuration, data.longBreakDuration])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (mode === 'focus') {
      const newCompletedPomodoros = data.completedPomodoros + 1
      const newTotalWorkTime = data.totalWorkTime + data.workDuration

      onUpdateRef.current({
        data: {
          ...data,
          completedPomodoros: newCompletedPomodoros,
          totalWorkTime: newTotalWorkTime
        }
      })

      // Play notification sound
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete! 🎉', {
          body: 'Great work! Time for a break.',
          icon: '/favicon.ico'
        })
      }

      // Auto-switch to break
      const blocksBeforeLongBreak = data.blocksBeforeLongBreak || 4
      const nextMode = newCompletedPomodoros % blocksBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak'
      setMode(nextMode)
      setTimeLeft(durations[nextMode])
    } else {
      // Break complete
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Complete! ⚡', {
          body: 'Ready to focus again?',
          icon: '/favicon.ico'
        })
      }
      setMode('focus')
      setTimeLeft(durations.focus)
    }
  }

  const toggleTimer = () => {
    if (!isRunning && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(durations[mode])
  }

  const switchMode = (newMode: PomodoroMode) => {
    // Don't do anything if already in that mode
    if (mode === newMode) return

    // If timer is running, always show warning regardless of mode
    if (isRunning) {
      setPendingMode(newMode)
      setShowModeChangeWarning(true)
      return
    }

    // If timer is not running, allow free switching
    setMode(newMode)
    setTimeLeft(durations[newMode])
  }

  const confirmModeChange = () => {
    if (pendingMode) {
      setMode(pendingMode)
      setTimeLeft(durations[pendingMode])
      setIsRunning(false)
      setPendingMode(null)
    }
    setShowModeChangeWarning(false)
  }

  const cancelModeChange = () => {
    setPendingMode(null)
    setShowModeChangeWarning(false)
  }

  const saveFocusTitle = () => {
    setIsEditingTitle(false)
    onUpdateRef.current({
      data: {
        ...data,
        focusTitle
      }
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeUnits = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    }
  }

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100
  const timeUnits = getTimeUnits(timeLeft)

  const getModeConfig = () => {
    switch (mode) {
      case 'focus':
        return {
          label: 'Focus',
          bgColor: 'bg-burgundy-500/15',
          textColor: 'text-burgundy-300',
          borderColor: 'border-burgundy-500/30',
          btnFill: 'bg-burgundy-600 hover:bg-burgundy-700 text-ivory-100'
        }
      case 'shortBreak':
        return {
          label: 'Short Break',
          bgColor: 'bg-forest-500/15',
          textColor: 'text-forest-300',
          borderColor: 'border-forest-500/30',
          btnFill: 'bg-forest-600 hover:bg-forest-700 text-ivory-100'
        }
      case 'longBreak':
        return {
          label: 'Long Break',
          bgColor: 'bg-brass-500/15',
          textColor: 'text-brass-300',
          borderColor: 'border-brass-500/30',
          btnFill: 'bg-brass-500 hover:bg-brass-600 text-surface-base'
        }
    }
  }

  const modeConfig = getModeConfig()

  return (
    <div className="flex flex-col h-full relative">
      {/* Mode Change Warning Modal */}
      {showModeChangeWarning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-card">
          <div className="bg-surface-overlay border border-hairline rounded-card p-6 max-w-sm mx-4 shadow-soft-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-burgundy-500/15 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-burgundy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary">
                {mode === 'focus' ? 'Study Block in Progress' : 'Break in Progress'}
              </h3>
            </div>
            <p className="text-secondary mb-6">
              {mode === 'focus'
                ? "You haven't finished your current focus session. Are you sure you want to switch modes? Your progress will be lost."
                : "Your break timer is still running. Switching modes will reset the timer. Are you sure you want to continue?"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelModeChange}
                className="flex-1 px-4 py-2 bg-transparent border border-hairline text-secondary rounded-control font-medium hover:text-primary hover:border-brass-700/60 transition-colors focus-visible:outline-none focus-visible:shadow-focus"
              >
                {mode === 'focus' ? 'Continue Studying' : 'Continue Break'}
              </button>
              <button
                onClick={confirmModeChange}
                className="flex-1 px-4 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-ivory-100 rounded-control font-medium shadow-soft-sm transition-colors focus-visible:outline-none focus-visible:shadow-focus"
              >
                Switch Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4 bg-surface-sunken p-1 rounded-card border border-hairline">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-control text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:shadow-focus ${
            mode === 'focus'
              ? 'bg-burgundy-600 text-ivory-100 shadow-soft-sm'
              : 'bg-transparent text-secondary hover:text-primary'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-control text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:shadow-focus ${
            mode === 'shortBreak'
              ? 'bg-forest-600 text-ivory-100 shadow-soft-sm'
              : 'bg-transparent text-secondary hover:text-primary'
          }`}
        >
          <span className="hidden sm:inline">Short Break</span>
          <span className="sm:hidden">Short</span>
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-control text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:shadow-focus ${
            mode === 'longBreak'
              ? 'bg-brass-500 text-surface-base shadow-soft-sm'
              : 'bg-transparent text-secondary hover:text-primary'
          }`}
        >
          <span className="hidden sm:inline">Long Break</span>
          <span className="sm:hidden">Long</span>
        </button>
      </div>

      {/* Focus Title Input */}
      {mode === 'focus' && (
        <div className="mb-3">
          {isEditingTitle ? (
            <input
              type="text"
              value={focusTitle}
              onChange={(e) => setFocusTitle(e.target.value)}
              onBlur={saveFocusTitle}
              onKeyDown={(e) => e.key === 'Enter' && saveFocusTitle()}
              placeholder="click to add focus title"
              autoFocus
              className="w-full bg-surface-sunken text-primary text-sm px-3 py-2 rounded-control border border-hairline focus-visible:outline-none focus-visible:shadow-focus placeholder:text-tertiary"
            />
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="w-full text-secondary text-sm px-3 py-2 rounded-control cursor-text hover:bg-surface-overlay transition-colors"
            >
              {focusTitle || 'click to add focus title'}
            </div>
          )}
        </div>
      )}

      {/* Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center my-2">
        {/* Big Time Display - responsive sizing */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="text-center">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-mono font-bold text-brass-200 tracking-tight">
              {timeUnits.hours !== '00' ? timeUnits.hours : timeUnits.minutes}
            </div>
            <div className="text-xs text-tertiary mt-1 font-medium uppercase tracking-wider">
              {timeUnits.hours !== '00' ? 'HR' : 'MIN'}
            </div>
          </div>
          <div className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-tertiary">:</div>
          <div className="text-center">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-mono font-bold text-brass-200 tracking-tight">
              {timeUnits.hours !== '00' ? timeUnits.minutes : timeUnits.seconds}
            </div>
            <div className="text-xs text-tertiary mt-1 font-medium uppercase tracking-wider">
              {timeUnits.hours !== '00' ? 'MIN' : 'SEC'}
            </div>
          </div>
          {timeUnits.hours !== '00' && (
            <>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-tertiary">:</div>
              <div className="text-center">
                <div className="text-5xl sm:text-6xl lg:text-7xl font-mono font-bold text-brass-200 tracking-tight">
                  {timeUnits.seconds}
                </div>
                <div className="text-xs text-tertiary mt-1 font-medium uppercase tracking-wider">
                  SEC
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mode Indicator */}
        <div className={`px-4 py-2 rounded-control ${modeConfig.bgColor} border ${modeConfig.borderColor}`}>
          <span className={`text-sm font-medium ${modeConfig.textColor}`}>
            Mode: {modeConfig.label}
          </span>
        </div>
      </div>

      {/* Start Timer Button */}
      <button
        onClick={toggleTimer}
        className={`w-full py-3 rounded-control font-semibold text-sm sm:text-base transition-colors shadow-soft mb-2 focus-visible:outline-none focus-visible:shadow-focus ${
          isRunning
            ? 'bg-cognac-600 hover:bg-cognac-700 text-ivory-100'
            : modeConfig.btnFill
        }`}
      >
        {isRunning ? 'Pause Timer' : 'Start Timer'}
      </button>

      {/* Additional Info - hide on small sizes */}
      <div className="text-center hidden sm:block">
        <p className="text-xs text-tertiary">
          Not into pomodoros? Try our stopwatch/time-tracker with Track
        </p>
      </div>

      {/* Stats at bottom */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-hairline">
        <div className="text-center p-2 bg-surface-overlay rounded-card border border-hairline">
          <div className="text-lg sm:text-xl font-serif text-burgundy-300">{data.completedPomodoros}</div>
          <div className="text-xs text-tertiary mt-1">Completed</div>
        </div>
        <div className="text-center p-2 bg-surface-overlay rounded-card border border-hairline">
          <div className="text-lg sm:text-xl font-serif text-brass-300">{Math.floor(data.totalWorkTime / 60)}h {data.totalWorkTime % 60}m</div>
          <div className="text-xs text-tertiary mt-1">Total Time</div>
        </div>
      </div>
    </div>
  )
}
