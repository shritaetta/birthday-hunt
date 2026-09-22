"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Cake, RotateCcw, Sparkle, Sparkles, Heart, Dot } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ConfettiBurst } from "@/components/confetti-burst"
import { SuccessCard } from "@/components/success-card"
import { WordleBoard, type Row } from "@/components/wordle-board"
import { WordleKeyboard } from "@/components/wordle-keyboard"
import {
  MAX_GUESSES,
  TARGET,
  WORD_LENGTH,
  mergeKeyState,
  scoreGuess,
  type TileState,
} from "@/lib/wordle"

// Exact positions/colors from the requested decorations array, rendered as
// icons so the glyphs display consistently across all devices and fonts.
const decorations = [
  { icon: '✦', className: 'left-[8%] top-[14%] text-rose' },
  { icon: '♡', className: 'left-[17%] top-[58%] text-mint-dark' },
  { icon: '✧', className: 'right-[10%] top-[20%] text-rose' },
  { icon: '♡', className: 'right-[18%] top-[74%] text-mint-dark' },
  { icon: '·', className: 'left-[6%] top-[81%] text-rose' },
  { icon: '✦', className: 'right-[6%] top-[49%] text-mint-dark' },
]

type Status = "playing" | "won" | "lost"

function makeInitialGuesses() {
  return [] as string[]
}

export function WordleGame() {
  const [guesses, setGuesses] = useState<string[]>(makeInitialGuesses)
  const [current, setCurrent] = useState("")
  const [status, setStatus] = useState<Status>("playing")
  const [keyStates, setKeyStates] = useState<Record<string, TileState>>({})
  const [shakeRow, setShakeRow] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    setGuesses([])
    setCurrent("")
    setStatus("playing")
    setKeyStates({})
    setShakeRow(null)
    setMessage("")
  }, [])

  const triggerShake = useCallback((rowIndex: number, text: string) => {
    setShakeRow(rowIndex)
    setMessage(text)
    if (shakeTimer.current) clearTimeout(shakeTimer.current)
    shakeTimer.current = setTimeout(() => setShakeRow(null), 500)
  }, [])

  const submitGuess = useCallback(() => {
    if (current.length !== WORD_LENGTH) {
      triggerShake(guesses.length, "Fill in all five letters first.")
      return
    }

    const guess = current.toUpperCase()
    const states = scoreGuess(guess)

    setKeyStates((prev) => {
      const next = { ...prev }
      for (let i = 0; i < guess.length; i++) {
        next[guess[i]] = mergeKeyState(next[guess[i]], states[i])
      }
      return next
    })

    const nextGuesses = [...guesses, guess]
    setGuesses(nextGuesses)
    setCurrent("")
    setMessage("")

    if (guess === TARGET) {
      setStatus("won")
    } else if (nextGuesses.length >= MAX_GUESSES) {
      setStatus("lost")
    }
  }, [current, guesses, triggerShake])

  const handleKey = useCallback(
    (rawKey: string) => {
      if (status !== "playing") return
      const key = rawKey.toUpperCase()

      if (key === "ENTER") {
        submitGuess()
        return
      }
      if (key === "BACK" || key === "BACKSPACE") {
        setCurrent((c) => c.slice(0, -1))
        setMessage("")
        return
      }
      if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) {
        setCurrent((c) => (c.length < WORD_LENGTH ? c + key : c))
      }
    },
    [current.length, status, submitGuess],
  )

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === "Enter" || e.key === "Backspace" || /^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault()
        handleKey(e.key)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleKey])

  useEffect(() => {
    return () => {
      if (shakeTimer.current) clearTimeout(shakeTimer.current)
    }
  }, [])

  // Build the six display rows.
  const rows: Row[] = Array.from({ length: MAX_GUESSES }).map((_, i) => {
    if (i < guesses.length) {
      const g = guesses[i]
      return { letters: g.split(""), states: scoreGuess(g), revealed: true }
    }
    if (i === guesses.length && status === "playing") {
      return { letters: current.split(""), states: [], revealed: false }
    }
    return { letters: [], states: [], revealed: false }
  })

  const attemptsLeft = MAX_GUESSES - guesses.length

  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Floating decorations */}
      {decorations.map((decoration, index) => (
        <span
          key={`${decoration.icon}-${index}`}
          aria-hidden="true"
          className={`animate-float-soft pointer-events-none absolute select-none font-serif text-3xl opacity-40 ${decoration.className}`}
          style={{ animationDelay: `${index * 0.6}s` }}
        >
          {decoration.icon}
        </span>
      ))}

      {status === "won" && <ConfettiBurst />}

      <section className="relative z-10 w-full max-w-lg">
        <div className="w-full rounded-[32px] border border-rose/30 bg-[#fffaf5] p-3.5 shadow-[0_18px_60px_color-mix(in_srgb,var(--rose)_18%,transparent)]">
          <div className="rounded-[24px] border-2 border-dotted border-rose/30 p-5 sm:p-7">
            
            {/* Top Header Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-full bg-mint text-rose">
                  <Heart className="size-4 fill-rose text-rose" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] text-[#d37c95] uppercase font-sans">
                  Birthday Mission
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#d37c95] font-sans">
                <span>28</span>
                <Sparkles className="size-3.5 fill-[#d37c95]/20 text-[#d37c95]" />
              </div>
            </div>

            <hr className="border-t border-dotted border-rose/25 mb-5" />

            {/* Inner Content Box */}
            <div className="rounded-2xl border border-rose/15 bg-white p-5 shadow-sm mb-5">
              <header className="mb-5 text-center">
                <h1 className="font-serif text-3xl font-bold tracking-tight text-[#d37c95] flex items-center justify-center gap-2">
                   Guess the Word
                </h1>
                <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground leading-relaxed">
                  Find the five-letter word to unlock your next clue. 
                </p>
              </header>

              <div className="mb-4">
                <WordleBoard rows={rows} shakeRow={shakeRow} />
              </div>

              <div
                role="status"
                aria-live="polite"
                className="mb-4 flex h-5 items-center justify-center text-center text-sm font-semibold text-rose"
              >
                {status === "playing"
                  ? message || `${attemptsLeft} ${attemptsLeft === 1 ? "try" : "tries"} left`
                  : status === "lost"
                    ? "Out of tries — take another swing!"
                    : ""}
              </div>

              {status === "won" ? (
                <SuccessCard onReset={reset} />
              ) : status === "lost" ? (
                <button
                  type="button"
                  onClick={reset}
                  className="mx-auto flex items-center gap-2 rounded-full bg-rose px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="size-4" />
                  Try again
                </button>
              ) : (
                <WordleKeyboard keyStates={keyStates} onKey={handleKey} disabled={status !== "playing"} />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
