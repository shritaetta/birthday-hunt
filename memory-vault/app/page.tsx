'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, Delete, Heart, LockKeyhole, RotateCcw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

const chapters = [
  { number: 1, title: 'Lime Soda & Grandpa', image: '/chapters/01-grandpa.png' },
  { number: 2, title: 'The Little Helper', image: '/chapters/02-medicine.png' },
  { number: 3, title: 'The Tiny Pea Experiment', image: '/chapters/03-pea.png' },
  { number: 4, title: 'Always Fashionably You', image: '/chapters/04-outfits.png' },
  { number: 5, title: 'A Little Star Student', image: '/chapters/05-ukg.png' },
  { number: 6, title: 'The Little Walk of Trust', image: '/chapters/06-school-walk.png' },
  { number: 7, title: 'My First Best Friend', image: '/chapters/07-baby-sister.jpeg' },
  { number: 8, title: 'From First Steps to Stage Lights', image: '/chapters/08-dance.jpeg' },
  { number: 9, title: 'The Purple Activa Academy', image: '/chapters/09-bike-ride.jpeg' },
  { number: 10, title: 'Lockdown Bakers, Full of Love', image: '/chapters/10-baking.jpeg' },
  { number: 11, title: 'The Knot That Tied Hearts Forever', image: '/chapters/11-wedding.jpeg' },
  { number: 12, title: 'The Hardest Goodbye', image: '/chapters/12-flight-usa.jpeg' },
  { number: 13, title: 'The Little Bundle of Joy', image: '/chapters/13-baby-boy.jpeg' },
]

const code = '6293'

export default function Page() {
  const [unlocked, setUnlocked] = useState(false)
  const [entered, setEntered] = useState('')
  const [chapter, setChapter] = useState(0)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const active = chapters[chapter]
  const progress = useMemo(() => ((chapter + 1) / chapters.length) * 100, [chapter])

  function pressDigit(digit: string) {
    if (entered.length >= 4) return
    const next = entered + digit
    setEntered(next)
    if (next === code) setTimeout(() => setUnlocked(true), 280)
  }

  function reset() {
    setUnlocked(false)
    setEntered('')
    setStarted(false)
    setEnded(false)
    setChapter(0)
  }

  return (
    <main className="book-shell">
      <div className="paper-grain" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.section key="lock" className="lock-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}>
            <p className="eyebrow">A little book of memories</p>
            <p className="lock-copy">A private collection of tiny moments, big feelings and all the love in between.</p>
            <h1>Enter your code to unlock</h1>
            <div className="pin-dots" aria-label={`${entered.length} of 4 digits entered`}>{[0,1,2,3].map((i) => <span key={i} className={i < entered.length ? 'filled' : ''} />)}</div>
            <div className="keypad" aria-label="Memory book passcode">
              {['1','2','3','4','5','6','7','8','9','','0','back'].map((digit, index) => digit === 'back' ? <button key={index} aria-label="Delete last digit" onClick={() => setEntered((value) => value.slice(0, -1))}><Delete size={17} /></button> : digit ? <button key={index} onClick={() => pressDigit(digit)}>{digit}</button> : <span key={index} />)}
            </div>
          </motion.section>
        ) : !started ? (
          <motion.section key="welcome" className="welcome-screen vault-welcome" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="vault-card">
              <p className="eyebrow">Memory Vault</p>
              <h1>Welcome to the<br />Memory Vault.</h1>
              <p className="vault-message">{"\nEach page contains a story from someone who loves you.\nSome are funny.\nSome are embarrassing.\nSome are unforgettable.\nAll of them are part of your story."}</p>
              <button className="primary-button" onClick={() => setStarted(true)}><BookOpen size={17} /> Open Vault</button>
            </div>
          </motion.section>
        ) : ended ? (
          <motion.section key="end" className="welcome-screen end-screen" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="heart-field" aria-hidden="true">{[0,1,2,3,4,5,6].map((heart) => <motion.span key={heart} style={{ left: `${12 + heart * 13}%`, animationDelay: `${heart * .35}s` }} animate={{ y: [8, -24, 8], opacity: [.35, .9, .35], rotate: [-12, 12, -12] }} transition={{ duration: 3.2 + heart * .2, repeat: Infinity, ease: 'easeInOut' }}><Heart size={heart % 2 ? 18 : 24} fill="currentColor" /></motion.span>)}</div>
            <div className="vault-card end-card">
              <div className="end-icon"><Heart size={27} fill="currentColor" /></div>
              <p className="eyebrow">The end, but never really</p>
              <h1>Happy<br /><em>Birthday!!!</em></h1>
              <p className="vault-message">{"These pages hold only a handful of memories.\nThere are hundreds more we couldn’t fit.\nThe conversations, the jokes, the trips, the celebrations, the ordinary days that became special because you were there.\nWishing you the Happiest Birthday!!!\nLove♥️♥️"}</p>
              <button className="primary-button" onClick={reset}><RotateCcw size={16} /> Read it again</button>
            </div>
          </motion.section>
        ) : (
          <motion.section key="book" className="reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="reader-header"><div className="brand"><Sparkles size={15} /> LITTLE MOMENTS</div><button className="reset-button" onClick={reset}><RotateCcw size={14} /> close book</button></header>
            <div className="reader-progress"><span>CHAPTER {String(active.number).padStart(2, '0')}</span><div><i style={{ width: `${progress}%` }} /></div><span>{String(chapters.length).padStart(2, '0')}</span></div>
            <div className="page-stage"><motion.div key={active.number} className="art-frame" initial={{ opacity: 0, rotateY: chapter > 0 ? 86 : -86, x: chapter > 0 ? 70 : -70 }} animate={{ opacity: 1, rotateY: 0, x: 0 }} exit={{ opacity: 0, rotateY: chapter > 0 ? -86 : 86 }} transition={{ duration: 0.72, ease: [0.22, 0.61, 0.36, 1] }}><img src={active.image} alt={`Illustrated page for chapter ${active.number}: ${active.title}`} /></motion.div></div>
            <nav className="reader-nav" aria-label="Chapter navigation"><button onClick={() => setChapter(Math.max(0, chapter - 1))} disabled={chapter === 0}><ArrowLeft size={17} /> Previous</button><div className="chapter-dots">{chapters.map((item, i) => <button key={item.number} aria-label={`Go to chapter ${item.number}`} className={i === chapter ? 'active' : ''} onClick={() => setChapter(i)} />)}</div><button onClick={() => chapter === chapters.length - 1 ? setEnded(true) : setChapter(chapter + 1)}>Next <ArrowRight size={17} /></button></nav>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}
