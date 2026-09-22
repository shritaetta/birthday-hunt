"use client"

import { Delete, CornerDownLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TileState } from "@/lib/wordle"

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
]

const keyStateClasses: Record<TileState, string> = {
  empty: "bg-paper text-foreground hover:bg-secondary/60",
  correct: "bg-mint text-mint-dark",
  present: "bg-amber text-amber-dark",
  absent: "bg-muted text-muted-foreground",
}

export function WordleKeyboard({
  keyStates,
  onKey,
  disabled,
}: {
  keyStates: Record<string, TileState>
  onKey: (key: string) => void
  disabled: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
          {row.map((key) => {
            const isAction = key === "ENTER" || key === "BACK"
            const state = keyStates[key] ?? "empty"
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => onKey(key)}
                aria-label={key === "BACK" ? "Delete letter" : key === "ENTER" ? "Submit guess" : key}
                className={cn(
                  "flex h-12 items-center justify-center rounded-lg border border-border text-sm font-bold uppercase shadow-sm transition-colors active:scale-95 disabled:opacity-50 sm:h-14",
                  isAction ? "px-2 sm:px-3" : "w-8 sm:w-10",
                  isAction ? "bg-rose text-primary-foreground" : keyStateClasses[state],
                )}
              >
                {key === "BACK" ? (
                  <Delete className="size-5" />
                ) : key === "ENTER" ? (
                  <CornerDownLeft className="size-5" />
                ) : (
                  key
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
