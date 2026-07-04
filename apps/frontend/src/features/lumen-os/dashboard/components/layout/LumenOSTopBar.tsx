import { useState, useEffect } from 'react'

interface LumenOSTopBarProps {
  onToggleUI: (visible: boolean) => void
  uiVisible: boolean
}

export default function LumenOSTopBar({ onToggleUI, uiVisible }: LumenOSTopBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false)
        })
      }
    }
  }

  const toggleUI = () => {
    onToggleUI(!uiVisible)
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear().toString().slice(-2)

    return `${dayName} · ${day} ${month} '${year}`
  }

  const getAmPm = (date: Date) => {
    return date.getHours() >= 12 ? 'PM' : 'AM'
  }

  // Active icon control — quiet warm hover + brass focus ring.
  const iconButton =
    'p-2 rounded-control text-brass-300 hover:text-brass-100 hover:bg-brass-500/10 transition-colors focus-visible:outline-none focus-visible:shadow-focus'
  // Not-yet-available control — reads as disabled, never fires an alert.
  const disabledIconButton = 'p-2 rounded-control text-tertiary cursor-not-allowed'
  const disabledAvatar =
    'w-8 h-8 rounded-full flex items-center justify-center bg-surface-sunken border border-hairline opacity-50 cursor-not-allowed'

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Real glass container so the icons + clock read as chrome, not floating over widgets. */}
      <div className="flex items-center gap-3 rounded-card border border-hairline bg-surface-raised/80 backdrop-blur-xl shadow-soft py-2 pl-2 pr-4">
        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Notifications — coming soon (disabled, no alert) */}
          <button
            type="button"
            className={disabledIconButton}
            title="Notifications — coming soon"
            aria-label="Notifications — coming soon"
            aria-disabled="true"
            disabled
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Profiles — coming soon (disabled, no alert) */}
          <button
            type="button"
            className={disabledAvatar}
            title="Game profile — coming soon"
            aria-label="Game profile — coming soon"
            aria-disabled="true"
            disabled
          >
            <span className="text-sm" aria-hidden="true">🎭</span>
          </button>
          <button
            type="button"
            className={disabledAvatar}
            title="Study profile — coming soon"
            aria-label="Study profile — coming soon"
            aria-disabled="true"
            disabled
          >
            <span className="text-sm" aria-hidden="true">📚</span>
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            className={iconButton}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            onClick={toggleFullscreen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
          </button>

          {/* Hide / show interface */}
          <button
            type="button"
            className={iconButton}
            title={uiVisible ? 'Hide interface' : 'Show interface'}
            aria-label={uiVisible ? 'Hide interface' : 'Show interface'}
            onClick={toggleUI}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {uiVisible ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              )}
            </svg>
          </button>
        </div>

        {/* Hairline divider */}
        <div className="w-px self-stretch bg-hairline" aria-hidden="true" />

        {/* Clock — refined mono, three text roles */}
        <div className="flex flex-col items-end leading-none">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-medium tracking-tight text-primary tabular-nums">
              {formatTime(currentTime)}
            </span>
            <span className="font-mono text-xs text-tertiary">
              {getAmPm(currentTime)}
            </span>
          </div>
          <div className="mt-1 font-sans text-xs tracking-wide text-secondary">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </div>
  )
}
