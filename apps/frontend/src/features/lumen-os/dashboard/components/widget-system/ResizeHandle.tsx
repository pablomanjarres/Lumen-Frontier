interface Props {
  isEditMode: boolean
  isMinimized: boolean
  onResizeStart: (e: React.MouseEvent) => void
}

export default function ResizeHandle({ isEditMode, isMinimized, onResizeStart }: Props) {
  if (!isEditMode || isMinimized) return null

  return (
    <div
      className="resize-handle group absolute bottom-0 right-0 z-20 h-8 w-8 cursor-nwse-resize touch-none"
      onMouseDown={onResizeStart}
    >
      {/* Larger invisible hit area */}
      <div className="absolute inset-0 -m-2" />

      {/* Brass corner bracket — a quiet, legible grab affordance. */}
      <svg
        className="pointer-events-none absolute bottom-1 right-1 h-4 w-4 text-brass-500/70 transition-colors group-hover:text-brass-300"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 6v9H6" />
        <path d="M15 11l-4 4" />
      </svg>
    </div>
  )
}
