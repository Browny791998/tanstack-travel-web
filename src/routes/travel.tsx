import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'

import TravelNavbar from '#/components/TravelNavbar'
import { ArrowRight, MapPin, Star, ChevronRight, ChevronLeft, Calendar, Umbrella, Mountain, Building, Compass, Landmark, TreePine, ChefHat, Crown, Bookmark, Clock, Briefcase, FileCheck, PiggyBank } from 'lucide-react'

export const Route = createFileRoute('/travel')({
  component: TravelWebsite,
})

interface Destination {
  id: string
  name: string
  image: string
  description: string
  background: string
  rating: number
  price: string
}

const destinations: Destination[] = [
  {
    id: '1',
    name: 'Broken Beach, Bali',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    description: 'A spectacular natural archway formed by the relentless ocean, where turquoise waters swirl in a circular cove.',
    background: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1920&q=80',
    rating: 4.9,
    price: '$450',
  },
  {
    id: '2',
    name: 'Kerala, India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    description: "Immerse yourself in \"God's Own Country\", famous for its emerald backwaters, palm-fringed beaches, and spice plantations.",
    background: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80',
    rating: 4.8,
    price: '$380',
  },
  {
    id: '3',
    name: 'Raja Ampat, Indonesia',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
    description: 'The global epicenter of marine biodiversity, featuring thousands of islands and pristine coral reefs.',
    background: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920&q=80',
    rating: 5.0,
    price: '$620',
  },
  {
    id: '4',
    name: 'Phi Phi Islands, Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    description: 'A tropical dreamland with limestone cliffs rising from crystal clear lagoons and vibrant nightlife.',
    background: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1920&q=80',
    rating: 4.7,
    price: '$410',
  },
]

function TravelWebsite() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Trending carousel state
  const [carouselIndex, setCarouselIndex] = useState(0)
  const totalCards = destinations.length

  // Marquee scroll-linked animation
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [marqueeOffset, setMarqueeOffset] = useState(0)
  const toolkitRef = useRef<HTMLElement>(null)
  const [toolkitVisible, setToolkitVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (!marqueeRef.current) return
      const rect = marqueeRef.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)))
      setMarqueeOffset(progress * 1000)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setToolkitVisible(true) },
      { threshold: 0.15 }
    )
    if (toolkitRef.current) observer.observe(toolkitRef.current)

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = (clientX / innerWidth - 0.5) * 20
    const y = (clientY / innerHeight - 0.5) * 20
    setMousePosition({ x, y })
  }

  const handleNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length)
      setIsTransitioning(false)
    }, 400)
  }, [isTransitioning])

  const handlePrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length)
      setIsTransitioning(false)
    }, 400)
  }, [isTransitioning])

  const handleSelect = (index: number) => {
    if (index === currentIndex || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
    }, 400)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Trending carousel controls
  const carouselPrev = () => setCarouselIndex((p) => Math.max(0, p - 1))
  const carouselNext = () => setCarouselIndex((p) => Math.min(totalCards - 1, p + 1))

  // Auto-play for trending carousel
  const [carouselHover, setCarouselHover] = useState(false)
  useEffect(() => {
    if (carouselHover || dragStartX.current !== null) return
    const timer = setInterval(() => {
      setCarouselIndex((p) => (p >= totalCards - 1 ? 0 : p + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [carouselHover, totalCards])

  // Drag for trending carousel
  const dragStartX = useRef<number | null>(null)
  const dragStartIndex = useRef(0)

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    dragStartX.current = x
    dragStartIndex.current = carouselIndex
  }
  const getCardStride = () => (Math.min(750, window.innerWidth * 0.85) + 32)

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current === null) return
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const delta = dragStartX.current - x
    if (Math.abs(delta) > getCardStride() / 3) {
      const newIndex = delta > 0
        ? Math.min(totalCards - 1, dragStartIndex.current + 1)
        : Math.max(0, dragStartIndex.current - 1)
      setCarouselIndex(newIndex)
      dragStartX.current = null
    }
  }
  const onDragEnd = () => { dragStartX.current = null }

  return (
    <main
      className="min-h-screen bg-slate-950 overflow-x-hidden selection:bg-[#2FA084] selection:text-white"
      onMouseMove={handleMouseMove}
    >
      <TravelNavbar />

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative min-h-[1100px] w-full flex items-center justify-center overflow-hidden">
        {/* Background parallax layers */}
        {destinations.map((dest, idx) => (
          <div
            key={`bg-${dest.id}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{
              transform: `scale(1.1) translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px)`,
              backgroundImage: `url(${dest.background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black/90" />
            <div className="absolute inset-0 backdrop-blur-[1px]" />
          </div>
        ))}

        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center pt-64 pb-64">
          {/* Left – hero content */}
          <div className="lg:col-span-7">
            <div className={`transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-y-10 blur-xl' : 'opacity-100 translate-y-0 blur-none'}`}>
              <div className="flex items-center gap-4 text-[#6FCF97] font-black mb-6 uppercase tracking-[0.5em] text-xs">
                <span className="w-16 h-[2px] bg-[#2FA084]" />
                <span>Featured Expedition</span>
              </div>

              <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/20 shadow-2xl">
                <h1 className="text-6xl md:text-8xl xl:text-9xl font-black text-white mb-6 leading-[0.85] tracking-tighter">
                  {destinations[currentIndex].name.split(',')[0].toUpperCase()}
                </h1>

                <div className="flex flex-wrap items-center gap-8 mb-10">
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={`s${i}`} size={16} fill={i < Math.floor(destinations[currentIndex].rating) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="text-white font-bold ml-1">{destinations[currentIndex].rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 border-l border-white/20 pl-8">
                    <MapPin size={18} className="text-[#6FCF97]" />
                    <span className="font-medium">{destinations[currentIndex].name.split(',').slice(1).join(',')}</span>
                  </div>
                </div>

                <p className="text-white/80 text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed font-medium">
                  {destinations[currentIndex].description}
                </p>

                {/* Stats panel */}
                <div className="grid grid-cols-3 gap-1 mb-12 max-w-xl">
                  {[
                    { label: 'Temp', value: '28°C', icon: '🌡️' },
                    { label: 'Flight', value: '4.5 hrs', icon: '✈️' },
                    { label: 'Season', value: 'Winter', icon: '❄️' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 first:rounded-l-2xl last:rounded-r-2xl not-last:border-r-0">
                      <p className="text-white/50 text-xs uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                      <p className="text-white font-black flex items-center gap-2">
                        <span className="text-lg">{stat.icon}</span>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-6">
                  <button type="button" className="group relative px-10 py-5 bg-white text-slate-900 rounded-full font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden">
                    <span className="relative z-10">BOOK EXPEDITION</span>
                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                    <div className="absolute inset-0 bg-[#2FA084] translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                    <span className="absolute inset-0 z-10 group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-4 font-black opacity-0 group-hover:opacity-100">
                      BOOK EXPEDITION <ArrowRight size={20} />
                    </span>
                  </button>
                  <button type="button" className="px-10 py-5 border-2 border-white/20 hover:border-white/50 text-white rounded-full font-black transition-all backdrop-blur-md flex items-center gap-3 active:scale-95">
                    <Calendar size={20} className="text-[#6FCF97]" />
                    PLAN JOURNEY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right – 3-D vertical carousel */}
          <div className="lg:col-span-5 relative h-[700px] flex items-center justify-center">
            {/* perspective must be on a wrapper, not the card itself */}
            {/* transformStyle on the wrapper enables 3D context for children */}
            <div
              className="relative w-full max-w-[400px] h-[550px]"
              style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
            >
              {destinations.map((dest, idx) => {
                const distance = (idx - currentIndex + destinations.length) % destinations.length
                const isActive = distance === 0

                let ty = 0, scale = 1, rx = 0, tz = 0, opacity = 0
                if      (distance === 0) { ty = 0;    scale = 1;    rx = 0;   tz = 60;   opacity = 1    }
                else if (distance === 1) { ty = 170;  scale = 0.82; rx = -20; tz = -80;  opacity = 0.6  }
                else if (distance === 2) { ty = 300;  scale = 0.64; rx = -35; tz = -180; opacity = 0.2  }
                else                     { ty = -170; scale = 0.82; rx = 20;  tz = -80;  opacity = 0.6  }

                return (
                  <button
                    type="button"
                    key={dest.id}
                    onClick={() => handleSelect(idx)}
                    aria-label={`Select ${dest.name}`}
                    className="absolute inset-0 w-full h-[420px] cursor-pointer appearance-none border-none bg-transparent p-0"
                    style={{
                      transform: `translateY(${ty}px) scale(${scale}) rotateX(${rx}deg) translateZ(${tz}px)`,
                      opacity,
                      zIndex: isActive ? 40 : distance === 1 || distance === destinations.length - 1 ? 30 : 20,
                      transition: 'transform 700ms cubic-bezier(0.23,1,0.32,1), opacity 700ms ease',
                    }}
                  >
                    {/* No overflow-hidden here — it flattens the 3D stack */}
                    <div
                      className={`relative h-full w-full rounded-[2.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] border-2 transition-[border-color] duration-700 ${isActive ? 'border-white/40' : 'border-transparent'}`}
                      style={{ overflow: 'hidden' }}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className={`w-full h-full object-cover transition-transform duration-2000 ${isActive ? 'scale-110' : 'scale-100'}`}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                      <div className={`absolute bottom-8 left-8 right-8 transition-all duration-700 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/50 font-bold text-[10px] mb-1 uppercase tracking-[0.2em]">Package</p>
                            <h3 className="text-2xl font-black text-white leading-tight underline decoration-[#6FCF97]/60 decoration-2 underline-offset-4">
                              {dest.name.split(',')[0]}
                            </h3>
                          </div>
                          <span className="text-2xl font-black text-white leading-none">{dest.price}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Carousel controls */}
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
              <button type="button" onClick={handlePrev} aria-label="Previous"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-xl hover:scale-110">
                <ChevronLeft size={22} className="rotate-90" />
              </button>
              <div className="flex flex-col items-center gap-3">
                {destinations.map((dest, idx) => (
                  <button key={dest.id} type="button" onClick={() => handleSelect(idx)} aria-label={`Slide ${idx + 1}`}
                    className={`rounded-full transition-all duration-500 ${idx === currentIndex ? 'h-10 w-1.5 bg-[#2FA084]' : 'h-1.5 w-1.5 bg-white/20 hover:bg-white/50'}`}
                  />
                ))}
              </div>
              <button type="button" onClick={handleNext} aria-label="Next"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-xl hover:scale-110">
                <ChevronRight size={22} className="rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Scroll-linked marquee text ─────────────────────────── */}
      <div ref={marqueeRef} className="relative py-24 bg-slate-950" style={{ overflow: 'hidden' }}>
        <style>{`
          .marquee-row { will-change: transform; }
        `}</style>
        {/* Row 1 – moves left on scroll */}
        <div className="marquee-row" style={{ display: 'flex', width: 'max-content', transform: `translateX(${marqueeOffset * -0.8}px)` }}>
          {[0, 1].map((n) => (
            <span key={n} style={{ fontSize: 'clamp(5rem,10vw,10rem)', fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 1, whiteSpace: 'nowrap', userSelect: 'none', paddingRight: '3rem' }}>
              ADVENTURE&nbsp;•&nbsp;EXPLORE&nbsp;•&nbsp;DISCOVER&nbsp;•&nbsp;JOURNEY&nbsp;•&nbsp;WANDER&nbsp;•&nbsp;BEYOND&nbsp;•&nbsp;
            </span>
          ))}
        </div>
        {/* Row 2 – moves right on scroll */}
        <div className="marquee-row" style={{ display: 'flex', width: 'max-content', marginTop: '-2rem', transform: `translateX(${marqueeOffset * 0.6}px)` }}>
          {[0, 1].map((n) => (
            <span key={n} style={{ fontSize: 'clamp(5rem,10vw,10rem)', fontWeight: 900, color: 'rgba(59,130,246,0.08)', lineHeight: 1, whiteSpace: 'nowrap', userSelect: 'none', paddingRight: '3rem' }}>
              PREMIUM&nbsp;•&nbsp;EXCLUSIVE&nbsp;•&nbsp;UNKNOWN&nbsp;•&nbsp;ESCAPE&nbsp;•&nbsp;WILD&nbsp;•&nbsp;PARADISE&nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Wave divider between marquee and explore ───────────── */}
      <div className="relative bg-slate-950 -mb-1">
        <svg className="w-full h-16 md:h-24 block" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#0f172a" d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* ── Category Section ──────────────────────────────────── */}
      <section className="relative pt-48 pb-96 overflow-hidden">
        <svg width="0" height="0" className="absolute" role="none" aria-hidden="true">
          <defs>
            <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
              <path d="M0,0 C 0.2 0.08, 0.4 0, 0.5 0.08 C 0.7 0.16, 0.8 0.08, 1 0.16 L1,1 L0,1 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="absolute top-0 left-0 w-full h-[300px] bg-slate-950 z-0"
          style={{ clipPath: 'url(#waveClip)', transform: 'scaleY(-1)', top: '-2px' }} />

        <div className="absolute inset-0 z-10 bg-slate-900 overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/video-explore.mp4" type="video/mp4" />
          </video>
          {/* deep vignette so text stays readable */}
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/40 to-slate-950/80" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/60 via-transparent to-slate-950/60" />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <div className="mb-10 flex justify-center">
            <div className="px-8 py-3 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full text-white text-sm font-black tracking-[0.2em] uppercase hover:border-white/40 transition-all cursor-default">
              🌿 <span className="ml-2">Adventure Awaits</span>
            </div>
          </div>
          <h2 className="text-7xl md:text-9xl font-black text-white mb-20 tracking-tighter">
            EXPLORE BY{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#6FCF97] to-[#1F6F5F]">STYLE</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Seaside', icon: Umbrella },
              { name: 'Mountain', icon: Mountain },
              { name: 'Urban', icon: Building },
              { name: 'Adventure', icon: Compass },
              { name: 'Legacy', icon: Landmark },
              { name: 'Ecosystems', icon: TreePine },
              { name: 'Culinary', icon: ChefHat },
              { name: 'Exclusive', icon: Crown },
            ].map((category) => (
              <button key={category.name} type="button"
                className="group relative flex items-center gap-5 px-6 py-5 bg-white/5 hover:bg-white/15 backdrop-blur-3xl border border-white/10 hover:border-white/40 rounded-3xl transition-all duration-500 text-left shadow-2xl hover:-translate-y-2">
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20">
                  <category.icon size={24} className="text-white/40 group-hover:text-white/70 transition-colors" />
                </div>
                <div className="min-w-0">
                  <span className="text-lg font-black text-white block tracking-tight leading-tight whitespace-nowrap">{category.name}</span>
                  <span className="text-[10px] text-white/40 font-black tracking-widest uppercase block mt-1">Visit Destinations</span>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#2FA084]/0 to-[#1F6F5F]/0 group-hover:from-[#2FA084]/5 group-hover:to-[#1F6F5F]/5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
          <svg className="w-full h-32 md:h-64 -mb-1 opacity-30" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,133.3C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
          <svg className="w-full h-32 md:h-64 -mb-1 opacity-50 absolute bottom-0 left-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,224L60,213.3C120,203,240,181,360,192C480,203,600,245,720,245.3C840,245,960,203,1080,170.7C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          </svg>
          <svg className="w-full h-32 md:h-64 -mb-1 absolute bottom-0 left-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,288L80,272C160,256,320,224,480,224C640,224,800,256,960,256C1120,256,1280,224,1360,208L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
          </svg>
        </div>
      </section>

      {/* ── Trending Adventures ───────────────────────────────── */}
      <section className="py-32 bg-slate-100 overflow-hidden">
        <div className="container mx-auto px-6 mb-16 flex justify-between items-end">
          <div>
            <p className="text-[#2FA084] font-black text-xs uppercase tracking-[0.4em] mb-3">This Season</p>
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Trending Adventures</h2>
            <p className="text-slate-500 text-lg max-w-md font-medium">Curated experiences that have captured our community's heart this season.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-bold text-sm">{carouselIndex + 1} / {totalCards}</span>
            <button type="button" onClick={carouselPrev} disabled={carouselIndex === 0}
              className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90">
              <ChevronLeft size={24} />
            </button>
            <button type="button" onClick={carouselNext} disabled={carouselIndex >= totalCards - 1}
              className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Track */}
        <div className="px-6 overflow-hidden"
          onMouseEnter={() => setCarouselHover(true)}
          onMouseLeave={() => { setCarouselHover(false); onDragEnd() }}
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
        >
          <div
            className="flex gap-8 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-grab active:cursor-grabbing"
            style={{ transform: `translateX(calc(-${carouselIndex} * (min(750px, 85vw) + 32px)))` }}
          >
            {destinations.map((dest, i) => (
              <div
                key={`${dest.id}-${i}`}
                className="shrink-0 w-[min(750px,85vw)] bg-white rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 flex h-[460px] select-none"
                style={{ transition: 'box-shadow 0.3s' }}
              >
                {/* Image half */}
                <div className="w-[45%] h-full shrink-0 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                </div>
                {/* Content half */}
                <div className="flex-1 p-10 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="flex items-center gap-1 text-yellow-400 mb-4">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} size={13} fill={si < Math.floor(dest.rating) ? 'currentColor' : 'none'} />
                      ))}
                      <span className="text-xs font-black text-slate-700 ml-1">{dest.rating}</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight leading-tight">
                      {dest.name.split(',')[0]}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400 mb-5">
                      <MapPin size={13} />
                      <span className="text-sm font-medium">{dest.name.split(',').slice(1).join(',').trim() || dest.name}</span>
                    </div>
                    <p className="text-slate-500 text-base leading-relaxed line-clamp-4 font-medium">
                      {dest.description}
                    </p>
                  </div>
                  <div className="mt-6 bg-slate-50 p-6 rounded-3xl flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Full Package</p>
                      <p className="text-3xl font-black text-slate-900">{dest.price}</p>
                    </div>
                    <a href={`/destinations`} className="w-14 h-14 bg-slate-950 text-white rounded-full flex items-center justify-center hover:bg-[#2FA084] transition-all shadow-xl group active:scale-95">
                      <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {destinations.map((_, i) => (
            <button key={i} type="button" onClick={() => setCarouselIndex(i)} aria-label={`Go to card ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === carouselIndex ? 'w-8 h-2 bg-slate-900' : 'w-2 h-2 bg-slate-300 hover:bg-slate-500'}`} />
          ))}
        </div>
      </section>

      {/* ── Traveler's Toolkit ───────────────────────────────── */}
      <section className="relative py-32 bg-slate-950 overflow-hidden" ref={toolkitRef}>
        <style>{`
          @keyframes snap-lid { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
          @keyframes stamp-doc { 0%, 100% { transform: scale(1) } 25% { transform: scale(0.85) } 50% { transform: scale(1.1) } }
          @keyframes coin-drop { 0% { transform: translateY(-12px) scale(0.8); opacity: 0 } 40% { opacity: 1 } 60% { transform: translateY(2px) scale(1) } 100% { transform: translateY(0) scale(1) } }
          .tk-card { opacity: 0; transform: translateY(60px) rotateX(15deg); transition: opacity 0.9s cubic-bezier(0.23,1,0.32,1), transform 0.9s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s; }
          .tk-card.visible { opacity: 1; transform: translateY(0) rotateX(0); }
          .group:hover .anim-snap-lid { animation: snap-lid 1.2s ease-in-out infinite; }
          .group:hover .anim-stamp-doc { animation: stamp-doc 1.2s ease-in-out infinite; }
          .group:hover .anim-coin-drop { animation: coin-drop 1.4s ease-in-out infinite; }
        `}</style>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full text-[#6FCF97] text-xs font-black tracking-[0.2em] uppercase mb-6">
              <Bookmark size={14} /> Traveler's Toolkit
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">KNOW BEFORE<br />YOU <span className="text-[#6FCF97]">GO</span></h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto font-medium">Expert guides, insider tips, and essential resources curated by our travel specialists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{ perspective: '1200px' }}>
            {[
              {
                title: 'Top 10 Packing Tips for Iceland',
                excerpt: 'Master the art of layering. From thermal base layers to waterproof shells — everything you need for subarctic conditions without overpacking.',
                category: 'Packing',
                Icon: Briefcase,
                animClass: 'anim-snap-lid',
                readTime: '5 min read',
                image: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&q=80',
                color: '#6FCF97',
              },
              {
                title: 'Visa Requirements for Bali',
                excerpt: 'Navigate Indonesian immigration with ease. Updated 2026 guide to VOA, e-VOA, and visa-free entry for 87 countries with step-by-step applications.',
                category: 'Visas',
                Icon: FileCheck,
                animClass: 'anim-stamp-doc',
                readTime: '8 min read',
                image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
                color: '#60a5fa',
              },
              {
                title: 'How to Travel on a Budget',
                excerpt: 'Stretch your dollar across 30 countries. Flight hacking, hostel gems, street food guides, and the hidden free experiences nobody talks about.',
                category: 'Budget',
                Icon: PiggyBank,
                animClass: 'anim-coin-drop',
                readTime: '12 min read',
                image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
                color: '#fbbf24',
              },
            ].map((article, i) => (
              <div
                key={article.title}
                className={`tk-card group relative bg-white/5 backdrop-blur-2xl border border-white/10 hover:border-white/30 rounded-[2.5rem] overflow-hidden ${toolkitVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 150}ms`, transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  const card = e.currentTarget
                  const rect = card.getBoundingClientRect()
                  const x = (e.clientX - rect.left) / rect.width - 0.5
                  const y = (e.clientY - rect.top) / rect.height - 0.5
                  card.style.transform = `perspective(1200px) rotateY(${x * 14}deg) rotateX(${y * -14}deg) translateY(0) scale(1.02)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) translateY(0) scale(1)'
                }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-5 right-5 flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-4 py-1.5 text-white/70 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={12} /> {article.readTime}
                  </div>
                  <button type="button" className="absolute top-5 left-5 w-9 h-9 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all hover:scale-110">
                    <Bookmark size={14} />
                  </button>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center ${article.animClass}`} style={{ color: article.color }}>
                      <article.Icon size={18} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: article.color }}>{article.category}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 leading-tight tracking-tight">{article.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-medium line-clamp-3">{article.excerpt}</p>
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Updated Mar 2026</span>
                    <button type="button" className="flex items-center gap-2 text-white/50 hover:text-[#6FCF97] text-xs font-bold transition-colors group/btn">
                      Read Guide <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: `inset 0 0 0 1px ${article.color}33, 0 25px 60px -15px ${article.color}22` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-slate-950 py-20 border-t border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#2FA084] rounded-xl flex items-center justify-center text-white">
                <MapPin size={24} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">Wanderlust</span>
            </div>
            <p className="text-slate-500 max-w-sm text-lg leading-relaxed mb-10">
              Redefining the art of discovery. We curate premium, immersive experiences for the modern explorer.
            </p>
            <div className="flex gap-6">
              {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                <a key={social} href="/" className="text-white font-bold hover:text-[#6FCF97] transition-colors">{social}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-sm">Destinations</h4>
            <ul className="space-y-4">
              {destinations.map((d) => (
                <li key={d.id}><a href="/destinations" className="text-slate-500 hover:text-white transition-colors">{d.name.split(',')[0]}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-sm">Newsletter</h4>
            <p className="text-slate-500 mb-6 font-medium">Get exclusive offers and travel news directly to your inbox.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white w-full focus:outline-none focus:border-[#2FA084] transition-colors" />
              <button type="button" className="bg-white text-black p-3 rounded-full hover:bg-[#2FA084] hover:text-white transition-all shrink-0">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 font-medium">© 2026 Wanderlust Travel. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="/" className="text-slate-600 hover:text-white text-sm font-bold transition-colors">Privacy Policy</a>
            <a href="/" className="text-slate-600 hover:text-white text-sm font-bold transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
