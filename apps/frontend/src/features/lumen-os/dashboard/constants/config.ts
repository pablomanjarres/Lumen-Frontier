/**
 * Dashboard Configuration Constants
 * Centralized configuration for all hardcoded values across the dashboard
 */

// Layout & Positioning
export const LAYOUT = {
  TOPBAR_HEIGHT: 64, // Height of the fixed top navigation bar (px)
  CONTENT_PADDING_TOP: 64, // Top padding for content area to clear topbar (px)
  CANVAS_MIN_HEIGHT: 1200, // Minimum canvas height (px)
  WIDGET_SPACING_X: 370, // Horizontal spacing between widgets (px)
  WIDGET_SPACING_Y: 320, // Vertical spacing between widgets (px)
  WIDGET_OFFSET_X: 20, // Left offset for first widget (px)
  WIDGET_OFFSET_Y: 64, // Top offset for first widget row (px)
  WIDGET_MIN_Y: 64, // Minimum Y position (can't be dragged above this)
} as const

// Widget Dimensions
export const WIDGET_SIZES = {
  small: { width: 280, height: 200 },
  medium: { width: 350, height: 300 },
  large: { width: 450, height: 400 },
  xlarge: { width: 600, height: 500 },
  minimized: { width: 280 }, // Width when minimized
} as const

export const WIDGET_CONSTRAINTS = {
  MIN_WIDTH: 250, // Minimum widget width (px)
  MIN_HEIGHT: 180, // Minimum widget height (px)
  HEADER_HEIGHT: 56, // Widget header height (px)
} as const

// Update Intervals
export const UPDATE_INTERVALS = {
  CLOCK: 1000, // Clock update interval (ms)
  POMODORO: 1000, // Pomodoro timer update interval (ms)
  AUTOSAVE_DEBOUNCE: 500, // Debounce time for localStorage saves (ms)
} as const

// Widget Specific Defaults
export const WIDGET_DEFAULTS = {
  // Notes Widget
  NOTES: {
    MAX_NOTES: 10,
    SHOW_TIMESTAMPS: true,
  },

  // Analytics Widget
  ANALYTICS: {
    TIME_RANGE: 'week' as 'day' | 'week' | 'month' | 'year',
    SHOW_GOALS: true,
  },

  // Progress Widget
  PROGRESS: {
    DAILY_GOAL_MINUTES: 60,
    CELEBRATE_STREAKS: true,
    CIRCLE_RADIUS: 56, // SVG circle radius
  },

  // Flashcards Widget
  FLASHCARDS: {
    CARDS_PER_SESSION: 20,
    ALGORITHM: 'spaced' as 'random' | 'spaced' | 'difficult',
    AUTO_FLIP: false,
  },

  // Quick Access Widget
  QUICK_ACCESS: {
    MAX_LINKS: 6,
    SHOW_ICONS: true,
  },

  // Calendar Widget
  CALENDAR: {
    DEFAULT_VIEW: 'month' as 'day' | 'week' | 'month',
    SHOW_WEEKENDS: true,
  },

  // Pomodoro Widget
  POMODORO: {
    WORK_DURATION: 25, // minutes
    SHORT_BREAK_DURATION: 5, // minutes
    LONG_BREAK_DURATION: 15, // minutes
    POMODOROS_UNTIL_LONG_BREAK: 4,
    CIRCLE_RADIUS: 88, // SVG circle radius
  },

  // Tasks Widget
  TASKS: {
    DEFAULT_PRIORITY: 'medium' as 'low' | 'medium' | 'high',
    DEFAULT_FILTER: 'all' as 'all' | 'active' | 'completed',
  },

  // Goals Widget
  GOALS: {
    DEFAULT_TARGET: 10,
    DEFAULT_UNIT: 'hours',
    DEFAULT_CATEGORY: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'custom',
  },
} as const

// Priority Colors — warm dark-mode semantics.
// forest = low / success · brass = medium / focus · burgundy = high / danger
export const PRIORITY_COLORS = {
  low: {
    bg: 'bg-forest-500/15',
    border: 'border-forest-500/30',
    text: 'text-forest-300',
    dot: 'bg-forest-500',
  },
  medium: {
    bg: 'bg-brass-500/15',
    border: 'border-brass-500/30',
    text: 'text-brass-300',
    dot: 'bg-brass-500',
  },
  high: {
    bg: 'bg-burgundy-500/15',
    border: 'border-burgundy-500/30',
    text: 'text-burgundy-300',
    dot: 'bg-burgundy-500',
  },
} as const

// Goal Category Colors — warm dark-mode palette (no generic blue/purple/green/gray)
export const CATEGORY_COLORS = {
  daily: {
    bg: 'bg-brass-500/15',
    text: 'text-brass-300',
    progress: 'from-brass-500 to-brass-600',
  },
  weekly: {
    bg: 'bg-cognac-500/15',
    text: 'text-cognac-300',
    progress: 'from-cognac-500 to-cognac-600',
  },
  monthly: {
    bg: 'bg-forest-500/15',
    text: 'text-forest-300',
    progress: 'from-forest-500 to-forest-600',
  },
  custom: {
    bg: 'bg-burgundy-500/15',
    text: 'text-burgundy-300',
    progress: 'from-burgundy-500 to-burgundy-600',
  },
} as const

// localStorage Keys
export const STORAGE_KEYS = {
  DASHBOARD_WIDGETS: 'dashboard_widgets',
  USER_PREFERENCES: 'user_preferences',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  STORAGE_QUOTA_EXCEEDED: 'localStorage quota exceeded - widget data may not persist',
  WIDGET_LOAD_ERROR: 'Error loading widgets',
  WIDGET_SAVE_ERROR: 'Error saving widgets to localStorage',
} as const
