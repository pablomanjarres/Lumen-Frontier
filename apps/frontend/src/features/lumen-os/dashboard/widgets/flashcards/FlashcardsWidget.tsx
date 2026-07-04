import { useState, useEffect, useRef } from 'react'
import type { WidgetProps } from '../../types'
import '@/styles/dashboard.css'

const SAMPLE_FLASHCARDS = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    category: 'Geography'
  },
  {
    id: '2',
    question: 'What is 2 + 2?',
    answer: '4',
    category: 'Math'
  },
  {
    id: '3',
    question: 'Who wrote "Romeo and Juliet"?',
    answer: 'William Shakespeare',
    category: 'Literature'
  }
]

export default function FlashcardsWidget({ config }: WidgetProps) {
  const flashcards = config.data?.flashcards || SAMPLE_FLASHCARDS
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studiedCount, setStudiedCount] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const currentCard = flashcards[currentIndex]
  const progress = `${((studiedCount / flashcards.length) * 100).toFixed(0)}%`

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = progress
    }
  }, [progress])

  const handleNext = () => {
    setIsFlipped(false)
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      if (!isFlipped) setStudiedCount(studiedCount + 1)
    } else {
      setCurrentIndex(0)
      setStudiedCount(flashcards.length)
    }
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="flex justify-between text-xs text-secondary mb-1">
          <span>Progress</span>
          <span>{studiedCount} / {flashcards.length} cards</span>
        </div>
        <div className="w-full h-2 bg-surface-sunken rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="progress-bar h-full bg-brass-500 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div
          className={`relative w-full h-64 cursor-pointer perspective-1000`}
          onClick={handleFlip}
        >
          <div
            className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            <div className="absolute w-full h-full backface-hidden bg-surface-overlay border border-hairline rounded-card p-6 flex flex-col items-center justify-center shadow-soft">
              <div className="text-xs font-medium text-brass-300 bg-brass-500/15 border border-brass-500/30 px-3 py-1 rounded-control mb-4">
                {currentCard.category}
              </div>
              <p className="text-lg font-serif text-primary text-center">
                {currentCard.question}
              </p>
              <p className="text-xs text-tertiary mt-6">Click to reveal answer</p>
            </div>

            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-surface-overlay border border-hairline rounded-card p-6 flex flex-col items-center justify-center shadow-soft">
              <svg className="w-8 h-8 text-forest-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-serif text-primary text-center">
                {currentCard.answer}
              </p>
              <p className="text-xs text-tertiary mt-6">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 bg-transparent border border-hairline text-secondary hover:text-primary hover:border-brass-700/60 disabled:opacity-50 disabled:cursor-not-allowed rounded-control transition-colors focus-visible:outline-none focus-visible:shadow-focus"
          aria-label="Previous flashcard"
          title="Previous card"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="text-sm text-secondary font-medium">
          {currentIndex + 1} / {flashcards.length}
        </span>

        <button
          onClick={handleNext}
          className="p-2 bg-brass-500 hover:bg-brass-600 text-surface-base rounded-control shadow-soft-sm transition-colors focus-visible:outline-none focus-visible:shadow-focus"
          aria-label="Next flashcard"
          title="Next card"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {studiedCount === flashcards.length && (
        <div className="mt-3 p-3 bg-forest-500/15 border border-forest-500/30 rounded-card text-center">
          <p className="text-sm font-medium text-forest-300">
            🎉 You've reviewed all cards!
          </p>
        </div>
      )}
    </div>
  )
}
