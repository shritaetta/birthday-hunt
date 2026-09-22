"use client"

import { Sparkles, RotateCcw } from "lucide-react"

export function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-card-rise mt-6 rounded-3xl border border-mint-dark/20 bg-mint p-6 text-mint-dark shadow-[0_10px_40px_-12px_rgba(77,120,104,0.4)] sm:p-8"
    >
      <div className="mb-3 flex items-center justify-center gap-2">
        
        <p className="text-lg font-bold tracking-wide">You found it!</p>
        
      </div>

      <p className="mb-4 text-center text-3xl font-extrabold">{"***3"}</p>

      <div className="flex flex-col gap-4 text-center leading-relaxed">
        <p>{"The next clue is waiting in a place that feels a little like nature and a little like home."}</p>
        <p>{"Look for the patch of green that watches the world."}</p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-mint-dark px-5 py-2.5 text-sm font-bold text-mint transition-transform active:scale-95"
      >
        <RotateCcw className="size-4" />
        Play again
      </button>
    </div>
  )
}
