export const TARGET = "GRASS"
export const WORD_LENGTH = 5
export const MAX_GUESSES = 6

export type TileState = "empty" | "correct" | "present" | "absent"

/**
 * Score a guess against the target with proper duplicate-letter handling.
 * First pass marks exact matches, second pass marks present letters using
 * a remaining-count map so extra duplicates read as absent.
 */
export function scoreGuess(guess: string, target: string = TARGET): TileState[] {
  const result: TileState[] = Array(guess.length).fill("absent")
  const remaining: Record<string, number> = {}

  for (let i = 0; i < target.length; i++) {
    const letter = target[i]
    remaining[letter] = (remaining[letter] ?? 0) + 1
  }

  // Pass 1: exact positions.
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct"
      remaining[guess[i]] -= 1
    }
  }

  // Pass 2: present-but-misplaced, limited by remaining counts.
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue
    const letter = guess[i]
    if ((remaining[letter] ?? 0) > 0) {
      result[i] = "present"
      remaining[letter] -= 1
    }
  }

  return result
}

/**
 * Merge per-key states so a key never downgrades
 * (correct beats present beats absent).
 */
export function mergeKeyState(current: TileState | undefined, next: TileState): TileState {
  const rank: Record<TileState, number> = { empty: 0, absent: 1, present: 2, correct: 3 }
  if (!current) return next
  return rank[next] > rank[current] ? next : current
}
