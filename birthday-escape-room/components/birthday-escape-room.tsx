'use client'

import { useEffect, useMemo, useState } from 'react'
import { Heart, KeyRound, Search, Sparkles } from 'lucide-react'

const letter = [
  "Today isn't just another birthday.",
  "It's a celebration of every little moment that has made you YOU.",
  'Over the years, you\'ve filled so many lives with warmth, kindness, chaos and happiness. So this year, instead of simply giving you a gift, I wanted to create an adventure made just for you.',
  "Scattered around the house are pieces of a Special Birthday. Each one holds a small fragment of today's surprise. To unlock it, you'll need to follow the clues, solve the puzzles and recover every fragment.",
  'Your curiosity will guide you.\nYour memories will help you.\nAnd a little bit of birthday magic will do the rest.',
  'Take your time.\nSmile at the clues.\nLaugh at the mistakes.\nEnjoy the journey.',
  "When you're ready, your first clue is waiting.",
]

const decorations = [
  { icon: '✦', className: 'left-[8%] top-[14%] text-rose' },
  { icon: '♡', className: 'left-[17%] top-[58%] text-mint-dark' },
  { icon: '✧', className: 'right-[10%] top-[20%] text-rose' },
  { icon: '♡', className: 'right-[18%] top-[74%] text-mint-dark' },
  { icon: '·', className: 'left-[6%] top-[81%] text-rose' },
  { icon: '✦', className: 'right-[6%] top-[49%] text-mint-dark' },
]

export function BirthdayEscapeRoom() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [clueOpen, setClueOpen] = useState(false)

  const fullLetter = useMemo(() => letter.join('\n\n'), [])

  useEffect(() => {
    if (visibleLines >= fullLetter.length) return
    const timer = window.setTimeout(() => {
      setTypedText(fullLetter.slice(0, visibleLines + 1))
      setVisibleLines((current) => current + 1)
    }, 24)
    return () => window.clearTimeout(timer)
  }, [fullLetter, visibleLines])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6 lg:py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {decorations.map((decoration, index) => (
          <span
            key={`${decoration.icon}-${index}`}
            className={`floating-decoration absolute select-none font-serif text-2xl ${decoration.className}`}
            style={{ animationDelay: `${index * 0.55}s` }}
          >
            {decoration.icon}
          </span>
        ))}
      </div>

      <section className="birthday-card relative w-full max-w-3xl rounded-3xl bg-card p-5 shadow-birthday sm:p-8 lg:p-12">
        <div className="absolute inset-2 rounded-[1.35rem] border-2 border-dotted border-rose/55 pointer-events-none sm:inset-3" aria-hidden="true" />
        <div className="relative">
          <header className="mb-8 flex items-center justify-between gap-4 sm:mb-10">
            <div className="flex items-center gap-3">
              <span className="heart-beat flex size-10 items-center justify-center rounded-full bg-mint text-rose shadow-sm">
                <Heart size={19} fill="currentColor" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-lg font-semibold uppercase tracking-[0.22em] text-rose">Birthday mission</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-rose" aria-label="28 birthday wishes">
              <span className="font-mono text-lg font-bold">28</span>
              <Sparkles size={20} aria-hidden="true" />
            </div>
          </header>

          <div className="letter-paper rounded-2xl bg-paper px-5 py-7 sm:px-8 sm:py-9">
            <div className="mb-6 flex flex-row items-center justify-center gap-3 border-b border-rose/15 pb-6 text-center whitespace-nowrap sm:gap-4">
              <img
                src="/birthday.gif"
                alt="Cute animated birthday wishes"
                className="birthday-gif h-16 w-16 shrink-0 object-contain sm:h-24 sm:w-24"
              />
              <h1 className="whitespace-nowrap font-serif text-[clamp(1.1rem,4.5vw,2.2rem)] font-bold leading-none tracking-tight text-rose">
                Happy Birthday Akkaaa<span aria-hidden="true">💖</span>
              </h1>
            </div>

            <div className="whitespace-pre-wrap font-sans text-[0.98rem] leading-7 text-muted-foreground sm:text-[1.03rem] sm:leading-8">
              {typedText}
              <span className="typewriter-caret ml-0.5 inline-block h-5 w-0.5 translate-y-1 bg-rose" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <button
              type="button"
              onClick={() => setClueOpen((open) => !open)}
              aria-expanded={clueOpen}
              aria-controls="first-clue"
              className="clue-button inline-flex items-center gap-2 rounded-full bg-rose px-6 py-3.5 font-sans text-sm font-bold text-primary-foreground shadow-md transition duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-4 focus-visible:ring-offset-card"
            >
              <KeyRound size={17} aria-hidden="true" />
              {clueOpen ? '✨ Hide the clue ✨' : '✨ Tap for your first clue ✨'}
            </button>
          </div>

          <div id="first-clue" className={`clue-reveal ${clueOpen ? 'is-open' : ''}`} aria-hidden={!clueOpen}>
            <div className="mt-6 rounded-2xl border-2 border-dashed border-rose/55 bg-mint p-5 text-center sm:p-7">
              <p className="mb-4 font-sans text-sm italic text-mint-dark">🔍 Hint: A little reflection might help you begin....</p>
              <div className="flex items-center justify-center gap-3 text-mint-dark">
                <p className="scale-x-[-1] font-mono text-base font-semibold leading-7 sm:text-lg">
                  Your journey begins at the thing that carried your life across the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
