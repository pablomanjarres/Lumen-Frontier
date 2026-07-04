import type { WidgetConfig } from '../../types'
import { WIDGET_CONSTRAINTS } from '../../constants'

interface WidgetHeaderProps {
  widget: WidgetConfig
  isEditMode: boolean
  isDragging: boolean
  onDragStart: (e: React.MouseEvent<HTMLDivElement>) => void
  onRemove: () => void
  onMinimize: () => void
  onSettings: () => void
}

// One control affordance shared by every header button — hairline-quiet at rest,
// a subtle warm wash on hover (see DESIGN-SYSTEM.md §5/§6).
const controlBase =
  'p-2 rounded-control text-secondary transition-colors focus-visible:outline-none focus-visible:shadow-focus'

export default function WidgetHeader({
  widget,
  isEditMode,
  isDragging,
  onDragStart,
  onMinimize,
  onRemove,
  onSettings
}: WidgetHeaderProps) {
  return (
    <div
      // Height is pinned to the single source of truth so it always matches the
      // `calc(100% - HEADER_HEIGHT)` content area in WidgetContainer.
      style={{ height: WIDGET_CONSTRAINTS.HEADER_HEIGHT }}
      className={`widget-header flex items-center justify-between border-b border-hairline px-4 ${
        isEditMode && !isDragging ? 'cursor-grab' : ''
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      onMouseDown={onDragStart}
    >
      <div className="flex min-w-0 items-center gap-2 pointer-events-none">
        {isEditMode && (
          <svg className="h-4 w-4 shrink-0 text-tertiary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z"/>
          </svg>
        )}
        <h3 className="truncate text-sm font-medium tracking-wide text-primary">{widget.title}</h3>
      </div>

      {/* Stop drag from starting when the intent is to click a control. */}
      <div
        className="widget-controls flex shrink-0 items-center gap-1"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Settings */}
        <button
          onClick={onSettings}
          className={`${controlBase} hover:bg-brass-500/10 hover:text-primary`}
          title="Widget settings"
          aria-label="Widget settings"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Minimize / expand */}
        <button
          onClick={onMinimize}
          className={`${controlBase} hover:bg-brass-500/10 hover:text-primary`}
          title={widget.minimized ? 'Expand' : 'Minimize'}
          aria-label={widget.minimized ? 'Expand widget' : 'Minimize widget'}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {widget.minimized ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            )}
          </svg>
        </button>

        {/* Remove (destructive → burgundy on hover) */}
        {isEditMode && (
          <button
            onClick={onRemove}
            className={`${controlBase} hover:bg-burgundy-500/15 hover:text-burgundy-300`}
            title="Remove widget"
            aria-label="Remove widget"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
