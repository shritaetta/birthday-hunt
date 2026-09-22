"use client"

import { cn } from "@/lib/utils"
import { MAX_GUESSES, WORD_LENGTH, type TileState } from "@/lib/wordle"

type Row = {
  letters: string[]
  states: TileState[]
  revealed: boolean
}

const tileStateClasses: Record<TileState, string> = {
  empty: "border-border bg-paper text-foreground",
  correct: "border-transparent bg-mint text-mint-dark",
  present: "border-transparent bg-amber text-amber-dark",
  absent: "border-transparent bg-muted text-muted-foreground",
}

export function WordleBoard({
  rows,
  shakeRow,
}: {
  rows: Row[]
  shakeRow: number | null
}) {
  return (
    <div className="flex flex-col gap-1.5" role="grid" aria-label="Word puzzle guesses">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          role="row"
          className={cn("flex justify-center gap-1.5", shakeRow === rowIndex && "animate-row-shake")}
        >
          {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
            const letter = row.letters[colIndex] ?? ""
            const state: TileState = row.revealed ? (row.states[colIndex] ?? "absent") : "empty"
            const hasLetter = letter.length > 0
            return (
              <div
                key={colIndex}
                role="gridcell"
                aria-label={
                  row.revealed
                    ? `${letter || "blank"}, ${row.states[colIndex] ?? "empty"}`
                    : letter || "blank"
                }
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl border-2 text-2xl font-bold uppercase transition-colors sm:size-14 sm:text-3xl",
                  tileStateClasses[state],
                  !row.revealed && hasLetter && "animate-tile-pop border-rose",
                  row.revealed && "animate-tile-flip",
                )}
                style={row.revealed ? { animationDelay: `${colIndex * 0.12}s` } : undefined}
              >
                {letter}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export type { Row }
export { MAX_GUESSES }
