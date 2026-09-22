'use client'

import { useState } from 'react'
import { Check, Eraser, RotateCcw, Sparkles, Heart } from 'lucide-react'

const decorations = [
  { icon: '✦', className: 'left-[8%] top-[14%] text-[#e995ad]' },
  { icon: '♡', className: 'left-[17%] top-[58%] text-[#4d7868]' },
  { icon: '✧', className: 'right-[10%] top-[20%] text-[#e995ad]' },
  { icon: '♡', className: 'right-[18%] top-[74%] text-[#4d7868]' },
  { icon: '·', className: 'left-[6%] top-[81%] text-[#e995ad]' },
  { icon: '✦', className: 'right-[6%] top-[49%] text-[#4d7868]' },
]

const solution = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [2, 3, 4, 5, 6, 1],
  [5, 6, 1, 2, 3, 4],
  [3, 4, 5, 6, 1, 2],
  [6, 1, 2, 3, 4, 5],
]

// A generous set of clues keeps this birthday puzzle friendly for first-time players.
const clues: Record<string, number> = {
  '0-0': 1, '0-1': 2, '0-3': 4, '0-5': 6,
  '1-0': 4, '1-2': 6, '1-4': 2,
  '2-1': 3, '2-2': 4, '2-4': 6,
  '3-0': 5, '3-3': 2, '3-5': 4,
  '4-1': 4, '4-3': 6, '4-4': 1,
  '5-0': 6, '5-2': 2, '5-4': 4, '5-5': 5,
}

const initialValues = solution.map((row, rowIndex) =>
  row.map((value, columnIndex) => clues[`${rowIndex}-${columnIndex}`] ?? null),
)

export default function Page() {
  const [values, setValues] = useState<(number | null)[][]>(initialValues)
  const [selectedCell, setSelectedCell] = useState<{ row: number; column: number } | null>(null)
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set())
  const [solved, setSolved] = useState(false)
  const [feedback, setFeedback] = useState('')
  const filled = values.flat().filter(Boolean).length

  function selectCell(row: number, column: number) {
    if (!solved && !clues[`${row}-${column}`]) {
      setSelectedCell({ row, column })
      setFeedback('')
    }
  }

  function updateSelectedCell(number: number | null) {
    if (!selectedCell || solved) return
    const { row, column } = selectedCell
    const key = `${row}-${column}`
    const next = values.map((currentRow) => [...currentRow])
    next[row][column] = number
    setValues(next)
    setWrongCells((current) => {
      const updated = new Set(current)
      if (number !== null && number !== solution[row][column]) updated.add(key)
      else updated.delete(key)
      return updated
    })
    setFeedback('')
  }

  function checkSolution() {
    if (filled < 36) {
      setFeedback('Almost there! Fill every little square before checking.')
      return
    }

    const correct = values.every((row, rowIndex) =>
      row.every((value, columnIndex) => value === solution[rowIndex][columnIndex]),
    )

    if (correct) {
      setFeedback('')
      setSelectedCell(null)
      setSolved(true)
    } else {
      setFeedback('Not quite yet — a few numbers are hiding in the wrong place.')
    }
  }

  function resetGame() {
    setValues(initialValues)
    setSelectedCell(null)
    setWrongCells(new Set())
    setSolved(false)
    setFeedback('')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12 flex items-center justify-center">
      {decorations.map((decoration, index) => (
        <span
          key={`${decoration.icon}-${index}`}
          aria-hidden="true"
          className={`pointer-events-none absolute hidden select-none font-serif text-3xl opacity-40 sm:block ${decoration.className} animate-pulse`}
          style={{ animationDelay: `${index * 0.6}s`, animationDuration: '4s' }}
        >
          {decoration.icon}
        </span>
      ))}

      <section className="relative z-10 w-full max-w-lg flex items-center justify-center">
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
                  A Little Number Magic
                </h1>
                <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground leading-relaxed">
                  Complete the friendly puzzle to unlock your next clue. Select an empty square, then tap a number below.
                </p>
              </header>

              {/* Progress Bar & Status */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-background/50 border border-rose/10 px-3.5 py-2">
                <div>
                  <p className="text-xs font-bold text-foreground">{filled} of 36 squares filled</p>
                  <p className="text-[10px] text-muted-foreground">
                    {solved ? 'Congratulations!' : selectedCell ? `Row ${selectedCell.row + 1}, Column ${selectedCell.column + 1}` : 'Select a square first'}
                  </p>
                </div>
                <div className="rounded-full bg-rose/10 px-2.5 py-1 text-xs font-bold text-[#d37c95]">
                  {solved ? 'Puzzle unlocked' : 'Nice and easy'}
                </div>
              </div>
              
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
                <div className="h-full rounded-full bg-[#e995ad] transition-all duration-500" style={{ width: `${(filled / 36) * 100}%` }} />
              </div>

              {/* Sudoku Board */}
              <div className="mx-auto max-w-[20rem] sm:max-w-xs rounded-xl bg-[#fffdf9] border border-rose/20 p-1.5 shadow-sm">
                <div className="relative grid grid-cols-6 overflow-hidden rounded-lg border-2 border-rose bg-card" aria-label="6 by 6 Sudoku puzzle">
                  {values.map((row, rowIndex) =>
                    row.map((value, columnIndex) => {
                      const key = `${rowIndex}-${columnIndex}`
                      const isClue = Boolean(clues[key])
                      const isSelected = selectedCell?.row === rowIndex && selectedCell.column === columnIndex
                      const isWrong = wrongCells.has(key)
                      const boxRight = columnIndex === 2
                      const boxBottom = rowIndex === 1 || rowIndex === 3
                      return (
                        <div key={key} className={`relative flex aspect-square items-center justify-center overflow-hidden border-border [perspective:500px] ${boxRight ? 'border-r-2 border-r-rose' : 'border-r'} ${boxBottom ? 'border-b-2 border-b-rose' : 'border-b'} ${columnIndex === 5 ? 'border-r-0' : ''} ${rowIndex === 5 ? 'border-b-0' : ''}`}>
                          {isClue ? (
                            <span className="text-lg font-extrabold text-mint-dark sm:text-xl" aria-label={`Clue ${value}`}>{value}</span>
                          ) : (
                            <button
                              type="button"
                              aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}${value ? `, ${value}` : ', empty'}`}
                              aria-pressed={isSelected}
                              onClick={() => selectCell(rowIndex, columnIndex)}
                              disabled={solved}
                              className={`size-full cursor-pointer text-lg font-extrabold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-default sm:text-xl ${isWrong ? 'bg-rose/55 text-rose-dark hover:bg-rose/65' : isSelected ? 'bg-mint text-mint-dark ring-2 ring-inset ring-rose' : 'text-foreground hover:bg-mint/60'}`}
                            >
                              {value ?? ''}
                            </button>
                          )}
                        </div>
                      )
                    }),
                  )}
                  {solved && (
                    <div
                      aria-label="Solved board showing one 6"
                      className="absolute inset-0 flex items-center justify-center bg-mint text-7xl font-extrabold text-mint-dark animate-flip sm:text-8xl"
                    >
                      6
                    </div>
                  )}
                </div>
              </div>

              {/* Keypad or Success Card */}
              {solved ? (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-[#e995ad] bg-mint p-5 text-center shadow-sm success-reveal">
                  <div className="mx-auto mb-3.5 flex size-11 items-center justify-center rounded-full bg-white text-lg font-bold text-[#4d7868] shadow-sm">
                    🔑
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#4d7868]">
                    Puzzle Solved!
                  </h2>
                  <p className="mt-3.5 text-xs font-semibold leading-relaxed text-[#4d7868] whitespace-pre-line opacity-95">
                    {`You've taken all the right steps.\n\nNow it's time to visit someone who has been\ncollecting toys much faster than memories.\n\nFind the smallest adventurer's treasure chest.`}
                  </p>
                  <button
                    type="button"
                    onClick={resetGame}
                    className="mt-5 inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-white hover:bg-white/80 px-4 text-[11px] font-bold text-[#4d7868] shadow-sm border border-emerald-100 transition active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="size-3" />
                    Play Again
                  </button>
                </div>
              ) : (
                <div className="mx-auto mt-5 max-w-[20rem] sm:max-w-xs" aria-label="Sudoku number pad">
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((number) => (
                      <button
                        key={number}
                        type="button"
                        aria-label={`Enter ${number}`}
                        onClick={() => updateSelectedCell(number)}
                        disabled={!selectedCell}
                        className="h-10 rounded-xl border border-rose/30 bg-white text-base font-bold text-[#d37c95] shadow-sm hover:bg-[#fbe9ee] disabled:opacity-40 sm:h-11 transition active:scale-95 cursor-pointer"
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      type="button"
                      aria-label="Erase selected square"
                      onClick={() => updateSelectedCell(null)}
                      disabled={!selectedCell}
                      className="col-span-2 h-10 rounded-xl border border-rose/30 bg-white text-sm font-bold text-rose-dark shadow-sm hover:bg-rose/10 disabled:opacity-40 sm:h-11 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Eraser className="size-3.5" /> Erase
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            {!solved && (
              <div className="flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={checkSolution}
                  className="w-full inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#e995ad] hover:bg-[#d37c95] px-6 text-xs font-bold text-white shadow-[0_4px_14px_rgba(233,149,173,0.45)] transition active:scale-95 cursor-pointer"
                >
                  <Check className="size-3.5" />
                  Check Solution ✦
                </button>
                {feedback && <p role="status" className="text-center text-xs font-bold text-rose-dark">{feedback}</p>}
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  )
}
