'use client'

import { useRef, useState } from 'react'
import { Heart, Sparkles, X } from 'lucide-react'

type Photo = {
  id: number
  src: string
  alt: string
  caption: string
}

const photos: Photo[] = [
  {
    id: 1,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-Aw23DbUK1zUUlzTkTGy3sPWFHbdjbU.jpeg',
    alt: 'Birthday portrait in a coral dress beneath a Happy Birthday banner',
    caption: 'A bright birthday moment',
  },
  {
    id: 2,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-xJVhO9hzZBAGgV8tNvdXEkgtR7EtKo.jpeg',
    alt: 'Woman in white seated beside a yellow birthday cake',
    caption: 'Cake, laughter, and home',
  },
  {
    id: 3,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oK2FZiHPpHDVOHXtjvgDSWbfij5fgY.png',
    alt: 'Young woman in a pink dress and party hat beside a cake',
    caption: 'The party girl era',
  },
  {
    id: 4,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sY78XFvLyNGNCuHD5UZLlBqyD12uBh.png',
    alt: 'Woman smiling while holding gold number 28 balloons in a garden',
    caption: 'Twenty-two and glowing',
  },
]

const decorations = [
  { icon: '✦', className: 'left-[8%] top-[14%] text-rose' },
  { icon: '♡', className: 'left-[17%] top-[58%] text-mint-dark' },
  { icon: '✧', className: 'right-[10%] top-[20%] text-rose' },
  { icon: '♡', className: 'right-[18%] top-[74%] text-mint-dark' },
  { icon: '·', className: 'left-[6%] top-[81%] text-rose' },
  { icon: '✦', className: 'right-[6%] top-[49%] text-mint-dark' },
]

const correctOrder = [4, 3, 2, 1]
const startingOrder = [2, 4, 1, 3]

export default function Page() {
  const [order, setOrder] = useState(startingOrder)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePhotoClick = (index: number) => {
    if (solved) return
    if (selectedIndex === null) {
      setSelectedIndex(index)
      return
    }
    if (selectedIndex === index) {
      setSelectedIndex(null)
      return
    }

    const nextOrder = [...order]
    ;[nextOrder[selectedIndex], nextOrder[index]] = [nextOrder[index], nextOrder[selectedIndex]]
    setOrder(nextOrder)
    setSelectedIndex(null)

    if (nextOrder.every((photoId, position) => photoId === correctOrder[position])) {
      setSolved(true)
      const playAttempt = audioRef.current?.play()
      playAttempt?.catch(() => setAudioBlocked(true))
    }
  }

  const replayAudio = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    const playAttempt = audioRef.current.play()
    playAttempt?.catch(() => setAudioBlocked(true))
    setAudioBlocked(false)
  }

  const resetPuzzle = () => {
    setOrder(startingOrder)
    setSelectedIndex(null)
    setSolved(false)
    setAudioBlocked(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // Calculate how many photos are in the correct place.
  const inPlaceCount = order.filter((photoId, idx) => photoId === correctOrder[idx]).length

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-12 bg-background">
      {/* Background heart trails */}
      <div className="pointer-events-none absolute inset-0 select-none z-0 overflow-hidden" aria-hidden="true">
        {/* Left heart loop trail */}
        <svg className="absolute left-[3%] top-[35%] w-36 h-auto text-rose/15 hidden md:block" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C30,70 40,50 30,40 C20,30 10,45 25,55 C40,65 60,40 55,25 C50,10 35,20 45,35" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeLinecap="round"/>
        </svg>

        {/* Right heart loop trail */}
        <svg className="absolute right-[3%] top-[35%] w-36 h-auto text-rose/15 scale-x-[-1] hidden md:block" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C30,70 40,50 30,40 C20,30 10,45 25,55 C40,65 60,40 55,25 C50,10 35,20 45,35" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Floating decorators */}
      {decorations.map((decoration, index) => (
        <span
          key={`${decoration.icon}-${index}`}
          aria-hidden="true"
          className={`floating-decoration pointer-events-none absolute z-0 select-none text-3xl font-light opacity-65 ${decoration.className}`}
          style={{ animationDelay: `${index * 0.55}s` }}
        >
          {decoration.icon}
        </span>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[32px] border border-[#f3c2ce] bg-[#fffaf5] p-3.5 shadow-[0_18px_0_rgba(233,149,173,0.28),0_28px_55px_rgba(81,67,74,0.12)]">
          <div className="rounded-[24px] border-2 border-dotted border-[#f3c2ce] px-5 py-7 sm:px-8 sm:py-9">
            
            {/* Top Header Bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="heart-beat flex size-10 items-center justify-center rounded-full bg-mint text-rose">
                  <Heart className="size-5 fill-rose text-rose" />
                </div>
                <span className="text-sm sm:text-base font-black tracking-[0.22em] text-[#d37c95] uppercase font-sans">
                  Birthday Mission
                </span>
              </div>
              <div className="flex items-center gap-2 text-base sm:text-lg font-black text-[#d37c95] font-sans">
                <span>28</span>
                <Sparkles className="size-5 fill-[#d37c95]/20 text-[#d37c95]" />
              </div>
            </div>

            <hr className="border-t border-dotted border-[#f3c2ce] mb-8" />

            {/* Inner Content Card (Polaroid Letter Look) */}
            <div className="rounded-2xl border border-rose/15 bg-white p-6 shadow-sm mb-8">
              <header className="mb-8 text-center">
                <h1 id="puzzle-title" className="font-serif text-3xl font-black tracking-tight text-rose sm:text-4xl">
                  Put the memories in order
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  A little timeline, a lot of love. Arrange these snapshots from the earliest memory to the newest one.
                </p>
                
                {/* Progress Steps (1, 2, 3, 4) */}
                <div className="mx-auto mt-7 flex items-center justify-center gap-3" aria-label="Puzzle progress">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className={`grid size-11 place-items-center rounded-full border text-sm sm:text-base font-bold ${step === 4 && solved ? 'border-mint-dark bg-mint text-mint-dark font-black' : 'border-[#f3c2ce] bg-white text-[#51434a]'}`}>
                        {step}
                      </span>
                      {step < 4 && <span className="h-px w-8 bg-[#f3c2ce] sm:w-14" aria-hidden="true" />}
                    </div>
                  ))}
                </div>
              </header>

              {/* Photo timeline grid */}
              <div className="mx-auto max-w-xl rounded-2xl border border-rose/10 bg-[#fffdf9] p-3 sm:p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" aria-label="Photo timeline">
                  {order.map((photoId, index) => {
                    const photo = photos.find((item) => item.id === photoId)!
                    const isSelected = selectedIndex === index
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => handlePhotoClick(index)}
                        aria-label={`${isSelected ? 'Selected' : 'Select'} photo ${index + 1}: ${photo.caption}`}
                        aria-pressed={isSelected}
                        className={`group relative overflow-hidden rounded-xl border-2 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring ${isSelected ? 'border-rose ring-4 ring-rose/25' : 'border-rose/15 hover:border-rose/40'}`}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img src={photo.src} alt={photo.alt} className="size-full object-cover transition duration-500 group-hover:scale-105" />
                          <span className="absolute left-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-sm font-black text-foreground shadow-sm">{index + 1}</span>
                        </div>
                        <span className="block min-h-[72px] p-2.5 text-xs sm:text-sm font-extrabold leading-tight text-foreground sm:p-3">{photo.caption}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions Row (Matches Screenshot positioning) */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="rounded-full bg-white border-2 border-[#f3c2ce] px-8 py-3.5 text-base sm:text-lg font-black text-[#d37c95] shadow-sm transition hover:bg-rose/5 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Show Preview
              </button>
              <button
                type="button"
                onClick={resetPuzzle}
                className="rounded-full bg-[#d37c95] px-8 py-3.5 text-base sm:text-lg font-black text-white shadow-sm transition hover:bg-[#d37c95]/95 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Start Over
              </button>
            </div>

            <audio ref={audioRef} preload="auto" className="sr-only" aria-label="Birthday recording">
              <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BdayRecording-srrAyCsxFRhnJJXA05b5CD2amt2TYk.mp3" type="audio/mpeg" />
            </audio>

          </div>
        </section>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#51434a]/30 px-5 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-2xl rounded-3xl border border-rose/20 bg-white p-8 shadow-2xl animate-pop-in">
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-rose/10 hover:text-rose transition cursor-pointer"
              aria-label="Close preview"
            >
              <X className="size-6" />
            </button>
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl font-black text-[#d37c95]">Puzzle Preview</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">This is the correct chronological order of the memories.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {correctOrder.map((photoId, idx) => {
                const photo = photos.find((p) => p.id === photoId)!
                return (
                  <div key={photo.id} className="rounded-xl border border-rose/10 bg-[#fffdf9] p-2 shadow-sm text-center">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg">
                      <img src={photo.src} alt={photo.alt} className="size-full object-cover" />
                    </div>
                    <span className="block text-xs sm:text-sm font-black text-foreground mt-2 leading-tight">{photo.caption}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {solved && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#51434a]/30 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="success-title">
          <div className="confetti" aria-hidden="true">✦　·　♡　✧　·　✦　♡　·　✧</div>
          <div className="relative w-full max-w-md rounded-[20px] border border-mint-dark/20 bg-mint p-5 sm:p-6 text-center text-mint-dark shadow-2xl animate-pop-in">
            <p className="text-base sm:text-lg font-black uppercase tracking-[0.25em] text-[#4d7868]">Chronology unlocked</p>
            <h2 id="success-title" className="mt-4 font-serif text-5xl sm:text-4xl font-black tracking-tight text-[#4d7868]">*2**</h2>
            <p className="mt-6 text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed text-[#4d7868]">You found the right rhythm. Your birthday message is playing now.</p>
            {audioBlocked && <p className="mt-6 rounded-2xl bg-white/70 px-6 py-4 text-sm sm:text-base font-bold text-[#4d7868]">Your browser blocked autoplay. Use the replay button to listen.</p>}
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={replayAudio}
                className="rounded-full border-2 border-[#4d7868]/30 bg-white/70 px-8 py-3.5 text-base sm:text-lg font-black text-mint-dark transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring cursor-pointer"
              >
                Replay audio
              </button>
              <button
                type="button"
                onClick={resetPuzzle}
                className="rounded-full bg-[#4d7868] px-8 py-3.5 text-base sm:text-lg font-black text-white transition hover:bg-[#4d7868]/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring cursor-pointer"
              >
                Play again
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
