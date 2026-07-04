interface LumenOSSidebarProps {
  onAddWidget: () => void
  onToggleEditMode: () => void
  onReset: () => void
  onUploadBackground: () => void
  isEditMode: boolean
  isVisible?: boolean
}

export default function LumenOSSidebar({
  onAddWidget,
  onToggleEditMode,
  onReset,
  onUploadBackground,
  isEditMode,
  isVisible = true
}: LumenOSSidebarProps) {
  const toolButton =
    'text-secondary hover:text-brass-300 hover:bg-brass-500/10 rounded-control p-2 transition-colors focus-visible:outline-none focus-visible:shadow-focus'

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 w-16 flex flex-col items-center py-4 z-50 backdrop-blur-xl bg-surface-raised/80 border-r border-hairline transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo / Home — brass plaque, near-black glyph */}
      <a href="/" className="group relative" title="Back to home">
        <div className="w-10 h-10 rounded-control bg-brass-500 hover:bg-brass-600 flex items-center justify-center transition-colors shadow-soft-sm">
          <svg className="w-6 h-6 text-surface-base" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-surface-overlay text-secondary text-xs font-medium rounded-control opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-hairline shadow-soft">
          Back to home
        </div>
      </a>

      {/* Spacer — primary navigation lives in the bottom bar */}
      <div className="flex-1" aria-hidden="true" />

      {/* Dashboard tools */}
      <nav className="flex flex-col gap-2" aria-label="Dashboard tools">
        <button onClick={onUploadBackground} className={toolButton} title="Background" aria-label="Change background">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <button onClick={onAddWidget} className={toolButton} title="Add widget" aria-label="Add widget">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <button onClick={onReset} className={toolButton} title="Reset dashboard" aria-label="Reset dashboard">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </nav>
    </div>
  )
}
