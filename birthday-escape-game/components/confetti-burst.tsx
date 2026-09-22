"use client"

import { useMemo } from "react"

const PASTELS = ["#e995ad", "#dff2e8", "#4d7868", "#f3c2ce", "#fffdf9", "#fbe9ee"]

type Piece = {
  left: number
  delay: number
  duration: number
  size: number
  color: string
  radius: number
}

export function ConfettiBurst({ count = 90 }: { count?: number }) {
  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.4 + Math.random() * 1.8,
      size: 7 + Math.random() * 9,
      color: PASTELS[i % PASTELS.length],
      radius: Math.random() > 0.5 ? 999 : 3,
    }))
  }, [count])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.radius,
            animation: `confetti-fall ${p.duration}s ${p.delay}s cubic-bezier(0.25, 0.6, 0.4, 1) forwards`,
          }}
        />
      ))}
    </div>
  )
}
