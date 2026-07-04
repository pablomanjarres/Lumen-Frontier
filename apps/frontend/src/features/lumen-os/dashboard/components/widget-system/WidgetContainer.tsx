import { useState, useEffect, useRef } from 'react'
import WidgetHeader from './WidgetHeader'
import WidgetRenderer from './WidgetRenderer'
import WidgetSettings from './WidgetSettings'
import ResizeHandle from './ResizeHandle'
import { useDrag } from '../../hooks'
import { useResize } from '../../hooks'
import { getWidgetMetadata } from '../../services'
import { WIDGET_CONSTRAINTS } from '../../constants'
import type { WidgetConfig } from '../../types'
import '@/styles/dashboard.css'

interface WidgetContainerProps {
  widget: WidgetConfig
  isEditMode: boolean
  onUpdate: (updates: Partial<WidgetConfig>) => void
  onRemove: () => void
}

export default function WidgetContainer({ widget, isEditMode, onUpdate, onRemove }: WidgetContainerProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const metadata = getWidgetMetadata(widget.type)

  const { isDragging, handleDragStart } = useDrag(
    { x: widget.position.x, y: widget.position.y },
    (positionUpdates) => {
      onUpdate({
        position: {
          ...widget.position,
          ...positionUpdates
        }
      })
    },
    true // Always enabled
  )

  const { isResizing, handleResizeStart } = useResize(
    { width: widget.position.width, height: widget.position.height },
    (sizeUpdates) => {
      onUpdate({
        position: {
          ...widget.position,
          ...sizeUpdates
        }
      })
    },
    true, // Always enabled
    {
      minWidth: metadata.minWidth,
      minHeight: metadata.minHeight,
      maxWidth: metadata.maxWidth,
      maxHeight: metadata.maxHeight
    }
  )

  const toggleMinimize = () => {
    onUpdate({ minimized: !widget.minimized })
  }

  // Update widget position/size dynamically via refs
  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.style.left = `${widget.position.x}px`
      widgetRef.current.style.top = `${widget.position.y}px`
      widgetRef.current.style.width = widget.minimized ? '280px' : `${widget.position.width}px`
      widgetRef.current.style.height = widget.minimized ? 'auto' : `${widget.position.height}px`
      widgetRef.current.style.cursor = isDragging ? 'grabbing' : isEditMode ? 'default' : 'default'
    }
  }, [widget.position.x, widget.position.y, widget.position.width, widget.position.height, widget.minimized, isDragging, isEditMode])

  const handleSaveSettings = (settings: Record<string, any>) => {
    // For pomodoro, the settings contain data that should be saved to widget.data
    if (widget.type === 'pomodoro' && settings.data) {
      onUpdate({ data: settings.data, settings })
    } else {
      onUpdate({ settings })
    }
  }

  return (
    <>
      <div
        ref={widgetRef}
        id={`widget-${widget.id}`}
        className={`widget-container absolute overflow-hidden rounded-card border bg-surface-raised ${
          isDragging || isResizing ? '' : 'transition-all duration-200'
        } ${
          isDragging
            ? 'z-50 border-brass-600/60 shadow-soft-lg'
            : isResizing
              ? 'z-50 border-brass-700/50 shadow-soft-lg'
              : isEditMode
                ? 'border-brass-800/40 shadow-soft'
                : 'border-hairline shadow-soft'
        } ${widget.minimized ? 'h-auto' : ''}`}
      >
        <WidgetHeader
          widget={widget}
          isEditMode={isEditMode}
          isDragging={isDragging}
          onDragStart={handleDragStart}
          onMinimize={toggleMinimize}
          onRemove={onRemove}
          onSettings={() => setIsSettingsOpen(true)}
        />
 
      {!widget.minimized && (
        <div
          className="widget-content p-3 overflow-auto text-primary"
          style={{ height: `calc(100% - ${WIDGET_CONSTRAINTS.HEADER_HEIGHT}px)` }}
        >
          <WidgetRenderer
            config={widget}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onMinimize={toggleMinimize}
            isEditing={isEditMode}
          />
        </div>
      )}

        <ResizeHandle
          isEditMode={true} // Always visible
          isMinimized={widget.minimized || false}
          onResizeStart={handleResizeStart}
        />
      </div>

      <WidgetSettings
        widget={widget}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </>
  )
}
