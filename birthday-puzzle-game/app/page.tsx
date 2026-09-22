'use client'

import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, Heart, RotateCcw, Sparkles } from 'lucide-react'

const IMAGE_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CzQZjmCMX2uVmBQPwm9lmaSRcSSgUl.png'
const SIZE = 3
const PIECE_COUNT = SIZE * SIZE

const DECORATIONS = [
  { icon: '✦', className: 'left-[8%] top-[14%] text-rose' },
  { icon: '♡', className: 'left-[17%] top-[58%] text-mint-dark' },
  { icon: '✧', className: 'right-[10%] top-[20%] text-rose' },
  { icon: '♡', className: 'right-[18%] top-[74%] text-mint-dark' },
  { icon: '·', className: 'left-[6%] top-[81%] text-rose' },
  { icon: '✦', className: 'right-[6%] top-[49%] text-mint-dark' },
]

function makeShuffledPieces() {
  const pieces = Array.from({ length: PIECE_COUNT }, (_, index) => index)
  let shuffled = [...pieces]

  do {
    shuffled = [...pieces].sort(() => Math.random() - 0.5)
  } while (shuffled.every((piece, index) => piece === index))

  return shuffled
}

function PuzzlePiece({
  piece,
  position,
  selected,
  onSelect,
}: {
  piece: number
  position: number
  selected: boolean
  onSelect: () => void
}) {
  const row = Math.floor(piece / SIZE)
  const column = piece % SIZE

  return (
    <button
      type="button"
      aria-label={`Puzzle piece ${piece + 1}, position ${position + 1}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={`puzzle-piece relative aspect-square overflow-hidden rounded-xl border-2 bg-paper transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 ${selected
          ? 'z-10 scale-[1.03] border-rose shadow-[0_0_0_4px_color-mix(in_srgb,var(--rose)_25%,transparent)]'
          : 'border-border hover:-translate-y-0.5 hover:border-rose/70 hover:shadow-md'
        }`}
      style={{
        backgroundImage: `url(${IMAGE_URL})`,
        backgroundPosition: `${(column / (SIZE - 1)) * 100}% ${(row / (SIZE - 1)) * 100}%`,
        backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
      }}
    >
      <span className="sr-only">Click to select and swap this piece.</span>
      {selected && (
        <span className="absolute inset-0 grid place-items-center bg-rose/20">
          <span className="rounded-full bg-card/90 px-2 py-1 text-xs font-bold text-foreground shadow-sm">
            Selected
          </span>
        </span>
      )}
    </button>
  )
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        delay: `${(index % 7) * 0.08}s`,
        duration: `${1.7 + (index % 5) * 0.2}s`,
        rotation: `${(index * 31) % 180}deg`,
      })),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti absolute top-[-10%] h-3 w-2 rounded-sm bg-rose"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            transform: `rotate(${piece.rotation})`,
          }}
        />
      ))}
    </div>
  )
}

export default function Page() {
  const [pieces, setPieces] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0])
  const [selected, setSelected] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    setPieces(makeShuffledPieces())
  }, [])

  const correctCount = pieces.filter((piece, index) => piece === index).length

  function handlePieceClick(position: number) {
    if (solved) return

    if (selected === null) {
      setSelected(position)
      return
    }

    if (selected === position) {
      setSelected(null)
      return
    }

    const nextPieces = [...pieces]
      ;[nextPieces[selected], nextPieces[position]] = [
        nextPieces[position],
        nextPieces[selected],
      ]
    setPieces(nextPieces)
    setSelected(null)

    if (nextPieces.every((piece, index) => piece === index)) {
      setSolved(true)
    }
  }

  function resetPuzzle() {
    setPieces(makeShuffledPieces())
    setSelected(null)
    setSolved(false)
    setShowPreview(false)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12 flex items-center justify-center">
      {DECORATIONS.map((dec, index) => (
        <span
          key={index}
          className={`absolute pointer-events-none select-none text-xl sm:text-3xl opacity-40 animate-pulse ${dec.className}`}
          style={{ animationDelay: `${index * 0.6}s`, animationDuration: '4s' }}
          aria-hidden="true"
        >
          {dec.icon}
        </span>
      ))}

      {solved && <Confetti />}

      <section className="relative mx-auto w-full max-w-lg flex items-center justify-center">
        <div className="w-full rounded-[32px] border border-rose/30 bg-[#fffaf5] p-3.5 shadow-[0_18px_60px_color-mix(in_srgb,var(--rose)_18%,transparent)]">
          <div className="rounded-[24px] border-2 border-dotted border-rose/30 p-5 sm:p-7">
            
            {/* Top Header Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-full bg-mint text-rose">
                  <Heart className="size-4 fill-rose text-[#e995ad]" />
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
                  Puzzle
                </h1>
                <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground leading-relaxed">
                  A little patience and one very special clue. Put the picture back together to continue.
                </p>
              </header>

              {/* Pieces in Place Status Bar */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-background/50 border border-rose/10 px-3.5 py-2">
                <div>
                  <p className="text-xs font-bold text-foreground">Piece by piece</p>
                  <p className="text-[10px] text-muted-foreground">Tap two pieces to swap them</p>
                </div>
                <div className="rounded-full bg-rose/10 px-2.5 py-1 text-xs font-bold text-[#d37c95]">
                  {correctCount} / {PIECE_COUNT} in place
                </div>
              </div>

              {/* Puzzle Board Container */}
              <div className="relative mx-auto max-w-xs sm:max-w-sm">
                <div className={`puzzle-board grid grid-cols-3 gap-1.5 rounded-xl bg-[#fffdf9] border border-rose/20 p-2 ${solved ? 'puzzle-solved' : ''}`}>
                  {pieces.map((piece, position) => (
                    <PuzzlePiece
                      key={`${position}-${piece}`}
                      piece={piece}
                      position={position}
                      selected={selected === position}
                      onSelect={() => handlePieceClick(position)}
                    />
                  ))}
                </div>

                {showPreview && !solved && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl bg-cover bg-center opacity-30 mix-blend-multiply border border-rose/20"
                    style={{ backgroundImage: `url(${IMAGE_URL})` }}
                    aria-hidden="true"
                  />
                )}

                {solved && (
                  <div className="success-reveal absolute inset-0 flex items-center justify-center rounded-xl bg-mint border-2 border-dashed border-[#e995ad] p-5 text-center">
                    <div className="max-w-xs">
                      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-white text-lg font-bold text-[#4d7868] shadow-sm">
                        **9
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-[#4d7868]">
                        Puzzle Solved!!!!
                      </h2>
                      <p className="mt-3 text-xs font-semibold leading-relaxed text-[#4d7868]">
                        Every journey starts with a single step...
                        <br />
                        <span className="mt-2 block font-normal text-[11px] opacity-90">
                          Your next clue is hiding on something you brought into our home - one gift, where countless steps are taken without ever leaving home.
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowPreview((value) => !value)}
                className="w-full sm:w-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#f3c2ce] bg-white px-5 text-xs font-bold text-[#d37c95] transition hover:bg-[#fbe9ee] shadow-sm active:scale-95 cursor-pointer"
                aria-pressed={showPreview}
              >
                {showPreview ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                type="button"
                onClick={resetPuzzle}
                className="w-full sm:w-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#e995ad] hover:bg-[#d37c95] px-5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(233,149,173,0.45)] transition active:scale-95 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                Start Over
              </button>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
