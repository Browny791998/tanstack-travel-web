import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import TravelNavbar from '#/components/TravelNavbar'
import { getFlights } from '#/lib/travel-fns'
import type { Flight } from '#/db/schema'
import { Plane, ArrowRight, ArrowLeftRight, Calendar, Users, Clock, Star, Filter, Wifi, Coffee, Zap, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/flights')({
  loader: async () => {
    const flights = await getFlights()
    return { flights }
  },
  component: FlightsPage,
})

const STOPS = ['Any','Non-stop','1 Stop','2+ Stops']
const AIRLINES = ['All Airlines','Emirates','Singapore Airlines','Qatar Airways','Turkish Airlines','Etihad','Japan Airlines']

function FlightsPage() {
  const [from, setFrom] = useState('New York')
  const [to, setTo] = useState('Dubai')
  const { flights } = Route.useLoaderData()
  const [activeStops, setActiveStops] = useState('Any')
  const [activeAirline, setActiveAirline] = useState('All Airlines')
  const [maxPrice, setMaxPrice] = useState(2000)
  const [sortBy, setSortBy] = useState('price')

  const flightFeatures = (f: Flight) => {
    try { return JSON.parse(f.features) as string[] } catch { return [] }
  }

  const filtered = flights.filter((f) => {
    const matchStops = activeStops === 'Any' || (activeStops === 'Non-stop' && f.stops === 0) || (activeStops === '1 Stop' && f.stops === 1) || (activeStops === '2+ Stops' && f.stops >= 2)
    const matchAirline = activeAirline === 'All Airlines' || f.airline === activeAirline
    return matchStops && matchAirline && f.price <= maxPrice
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'duration') return a.duration.localeCompare(b.duration)
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const featureIcon = (f: string) => {
    if (f === 'WiFi') return <Wifi size={14} />
    if (f === 'Meals') return <Coffee size={14} />
    if (f === 'Entertainment') return <Zap size={14} />
    if (f === 'Lie-flat') return <Plane size={14} />
    return null
  }

  return (
    <main className="min-h-screen bg-slate-950 overflow-x-hidden selection:bg-[#2FA084] selection:text-white">
      <TravelNavbar />

      {/* Hero Search */}
      <section className="relative min-h-[70vh] w-full flex items-end justify-center overflow-hidden pb-20">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://videos.pexels.com/video-files/3842346/3842346-hd_1920_1080_24fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-slate-950/50" />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-transparent to-slate-950" />
        </div>

        <div className="relative z-10 container mx-auto px-6 w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full text-white text-xs font-black tracking-[0.2em] uppercase mb-6">
              <Plane size={14} /> Find Your Next Journey
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">SKYBOUND</h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">Search and compare flights from 500+ airlines worldwide. Best prices guaranteed.</p>
          </div>

          <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-4 md:p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-3xl px-6 py-5 hover:border-white/30 transition-colors">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">From</label>
                <div className="flex items-center gap-3">
                  <Plane size={20} className="text-[#6FCF97] -rotate-45" />
                  <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-transparent text-white font-black text-lg w-full focus:outline-none" placeholder="Origin" />
                </div>
              </div>
              <div className="md:col-span-1 flex justify-center">
                <button type="button" className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-[#2FA084] transition-all">
                  <ArrowLeftRight size={18} />
                </button>
              </div>
              <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-3xl px-6 py-5 hover:border-white/30 transition-colors">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">To</label>
                <div className="flex items-center gap-3">
                  <Plane size={20} className="text-[#6FCF97] rotate-[135deg]" />
                  <input type="text" value={to} onChange={(e) => setTo(e.target.value)} className="bg-transparent text-white font-black text-lg w-full focus:outline-none" placeholder="Destination" />
                </div>
              </div>
              <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-3xl px-6 py-5 hover:border-white/30 transition-colors">
                <label className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Departure</label>
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-[#6FCF97]" />
                  <span className="text-white font-black text-lg">24 Apr 2026</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <button type="button" className="w-full h-full min-h-[72px] bg-white text-slate-950 rounded-3xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#2FA084] hover:text-white transition-all shadow-xl">
                  SEARCH
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-4 px-2">
              <span className="flex items-center gap-2 text-white/60 text-sm font-bold"><Users size={16} /> 2 Passengers</span>
              <span className="flex items-center gap-2 text-white/60 text-sm font-bold">Economy</span>
              <span className="flex items-center gap-2 text-white/60 text-sm font-bold">Round Trip</span>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Filters */}
          <aside className="lg:col-span-3">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 sticky top-32">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <h2 className="text-xl font-black text-white tracking-tight">Filters</h2>
                <Filter size={18} className="text-white/40" />
              </div>
              <div className="mb-10">
                <span className="text-xs font-black text-white/40 uppercase tracking-widest mb-4 block">Stops</span>
                <div className="space-y-2">
                  {STOPS.map((s) => (
                    <button key={s} type="button" onClick={() => setActiveStops(s)} className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeStops === s ? 'bg-[#2FA084] text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="mb-10">
                <span className="text-xs font-black text-white/40 uppercase tracking-widest mb-4 block">Airlines</span>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {AIRLINES.map((a) => (
                    <button key={a} type="button" onClick={() => setActiveAirline(a)} className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeAirline === a ? 'bg-[#2FA084] text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>{a}</button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <span className="text-xs font-black text-white/40 uppercase tracking-widest mb-4 block">Max Price</span>
                <input type="range" min={500} max={3000} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#2FA084] h-2 bg-white/10 rounded-full appearance-none cursor-pointer" />
                <div className="flex justify-between mt-3 text-white font-black text-sm">
                  <span>$500</span><span className="text-[#6FCF97]">${maxPrice}</span>
                </div>
              </div>
              <button type="button" onClick={() => { setActiveStops('Any'); setActiveAirline('All Airlines'); setMaxPrice(2000) }} className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all border border-white/5">Reset Filters</button>
            </div>
          </aside>

          {/* Flight List */}
          <main className="lg:col-span-9">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <p className="text-white/40 text-sm font-bold mb-1">{sorted.length} flights found</p>
                <h2 className="text-3xl font-black text-white tracking-tighter">{from} <span className="text-[#6FCF97]">→</span> {to}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-xs font-black uppercase tracking-widest">Sort by</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-900/50 border border-white/10 text-white font-bold text-sm rounded-2xl px-5 py-3 focus:outline-none focus:border-[#2FA084] cursor-pointer">
                  <option value="price">Price</option>
                  <option value="duration">Duration</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {sorted.map((flight) => (
                <div key={flight.id} className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-[#2FA084]/30 rounded-[2.5rem] p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2FA084]/5">
                  {flight.badge && <div className="absolute -top-3 right-8 bg-[#2FA084] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">{flight.badge}</div>}
                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                    <div className="flex items-center gap-4 min-w-[160px]">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg"><Plane size={24} className="text-slate-900" /></div>
                      <div>
                        <p className="text-white font-black text-sm tracking-tight">{flight.airline}</p>
                        <div className="flex items-center gap-1 text-yellow-400 mt-1"><Star size={12} fill="currentColor" /><span className="text-xs font-black text-white/60">{flight.rating}</span></div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-6 min-w-[280px]">
                      <div className="text-center"><p className="text-2xl font-black text-white">{flight.fromCode}</p><p className="text-white/40 text-xs font-bold mt-1">{flight.departure}</p></div>
                      <div className="flex-1 flex flex-col items-center">
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">{flight.duration}</p>
                        <div className="w-full h-[2px] bg-white/10 relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-950 border-2 border-white/20 rounded-full" />
                          {flight.stops > 0 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full" />}
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${flight.stops === 0 ? 'text-[#6FCF97]' : 'text-yellow-500'}`}>{flight.stopsLabel}</p>
                      </div>
                      <div className="text-center"><p className="text-2xl font-black text-white">{flight.toCode}</p><p className="text-white/40 text-xs font-bold mt-1">{flight.arrival}</p></div>
                    </div>
                    <div className="flex items-center gap-6 lg:min-w-[200px] lg:justify-end">
                      <div className="text-right">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Per Person</p>
                        <p className="text-3xl font-black text-white">${flight.price.toLocaleString()}</p>
                      </div>
                      <button type="button" className="w-14 h-14 bg-white text-slate-950 rounded-2xl flex items-center justify-center hover:bg-[#2FA084] hover:text-white transition-all shadow-xl group-hover:scale-110 active:scale-95 shrink-0"><ArrowRight size={22} /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/5">
                    {flightFeatures(flight).map((f: string) => (
                      <span key={f} className="inline-flex items-center gap-2 text-white/40 text-xs font-bold px-3 py-1.5 bg-white/5 rounded-full border border-white/5">{featureIcon(f)}{f}</span>
                    ))}
                    <span className="inline-flex items-center gap-2 text-[#6FCF97] text-xs font-bold px-3 py-1.5 bg-[#2FA084]/10 rounded-full border border-[#2FA084]/20 ml-auto"><ShieldCheck size={14} />Price Guarantee</span>
                  </div>
                </div>
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-24">
                <Plane size={48} className="text-white/10 mx-auto mb-6" />
                <p className="text-white/40 font-bold text-lg mb-2">No flights match your filters.</p>
                <button type="button" onClick={() => { setActiveStops('Any'); setActiveAirline('All Airlines'); setMaxPrice(2000) }} className="text-[#6FCF97] font-black underline text-sm">Reset all filters</button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-white/5 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ icon: <ShieldCheck size={28} />, label: 'Secure Booking', sub: 'SSL Encrypted' },{ icon: <Zap size={28} />, label: 'Best Price', sub: 'Price Match' },{ icon: <Clock size={28} />, label: '24/7 Support', sub: 'Always Here' },{ icon: <Star size={28} />, label: 'Trusted', sub: '4.9/5 Rating' }].map((t) => (
              <div key={t.label} className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#6FCF97]">{t.icon}</div>
                <p className="text-white font-black text-sm tracking-tight">{t.label}</p>
                <p className="text-white/30 text-xs font-medium">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-20 border-t border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#2FA084] rounded-xl flex items-center justify-center text-white"><Plane size={24} /></div>
              <span className="text-2xl font-black text-white tracking-tighter">Skybound</span>
            </div>
            <p className="text-slate-500 max-w-sm text-lg leading-relaxed mb-10">Your gateway to the skies. Compare, book, and fly with confidence across 500+ airlines worldwide.</p>
            <div className="flex gap-6">
              {['Instagram','Twitter','Facebook'].map((s) => (
                <a key={s} href="/" className="text-white font-bold hover:text-[#6FCF97] transition-colors">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-sm">Popular Routes</h4>
            <ul className="space-y-4">
              {['New York → Dubai','London → Singapore','Paris → Bangkok','Sydney → London'].map((r) => (
                <li key={r}><span className="text-slate-500 hover:text-white transition-colors cursor-pointer">{r}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-sm">Newsletter</h4>
            <p className="text-slate-500 mb-6 font-medium">Get flight deals and travel news directly to your inbox.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white w-full focus:outline-none focus:border-[#2FA084] transition-colors" />
              <button type="button" className="bg-white text-black p-3 rounded-full hover:bg-[#2FA084] hover:text-white transition-all shrink-0"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 font-medium">2026 Skybound Travel. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="/" className="text-slate-600 hover:text-white text-sm font-bold transition-colors">Privacy Policy</a>
            <a href="/" className="text-slate-600 hover:text-white text-sm font-bold transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
