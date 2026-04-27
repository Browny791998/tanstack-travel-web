import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import TravelNavbar from '#/components/TravelNavbar'
import { getDestinations, getWishlistIds, toggleWishlist } from '#/lib/travel-fns'
import { Search, MapPin, Star, Filter, ArrowRight, Heart } from 'lucide-react'
import type { Destination } from '#/db/schema'

export const Route = createFileRoute('/destinations')({
  loader: async () => {
    const [destinations, wishlistIds] = await Promise.all([getDestinations(), getWishlistIds()])
    return { destinations, wishlistIds }
  },
  component: DestinationsExplorer,
})

const CATEGORIES = ['All', 'Beach', 'Mountain', 'City', 'Desert', 'Tropical']

function DestinationsExplorer() {
  const { destinations, wishlistIds: initialIds } = Route.useLoaderData()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set(initialIds))

  const filtered = destinations.filter((d) => {
    const matchCategory = activeCategory === 'All' || d.category === activeCategory
    const matchSearch =
      search === '' ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const featured = destinations.find((d) => d.name === 'Amalfi Coast') ?? destinations[0]

  async function handleToggleWishlist(e: React.MouseEvent, destId: number) {
    e.preventDefault()
    const result = await toggleWishlist({ data: { destinationId: destId } })
    setWishlisted((prev) => {
      const next = new Set(prev)
      result.wishlisted ? next.add(destId) : next.delete(destId)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden selection:bg-[#2FA084] selection:text-white">
      <TravelNavbar />

      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline crossOrigin="anonymous" className="w-full h-full object-cover">
            <source src="https://videos.pexels.com/video-files/1739010/1739010-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-transparent to-slate-50" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center pt-20">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter drop-shadow-2xl">
            Destinations Explorer
          </h1>
          <div className="max-w-3xl mx-auto">
            <div className="relative group mb-8">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by destination or country…"
                className="w-full h-20 pl-10 pr-24 md:px-14 bg-white/95 backdrop-blur-3xl rounded-full text-lg md:text-xl font-medium focus:ring-4 focus:ring-[#2FA084]/30 focus:outline-none shadow-2xl transition-all group-hover:scale-[1.02]"
              />
              <div className="absolute left-8 md:hidden top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={24} />
              </div>
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 h-14 px-8 bg-slate-900 hover:bg-[#2FA084] text-white rounded-full font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl">
                <Search size={20} className="hidden md:block" />
                EXPLORE
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {['Beach', 'Mountain', 'City', 'Tropical'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveCategory(filter === activeCategory ? 'All' : filter)}
                  className={`px-8 py-3 backdrop-blur-2xl border border-white/30 rounded-full font-black text-sm tracking-widest uppercase transition-all shadow-lg active:scale-95 ${activeCategory === filter ? 'bg-white text-slate-900' : 'bg-white/20 text-white hover:bg-white hover:text-slate-900'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 sticky top-32">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Filters</h2>
                <Filter size={20} className="text-slate-400" />
              </div>

              <div className="mb-10">
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 block">Category</span>
                <div className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setActiveCategory('All'); setSearch('') }}
                className="w-full py-5 bg-slate-50 text-slate-950 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-all active:scale-95"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Gallery */}
          <main className="lg:col-span-3">
            {/* Featured Card */}
            {featured && (
              <a href={`/destinations/${featured.id}`} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 flex flex-col md:flex-row mb-16 shadow-xl shadow-slate-200/50 group hover:shadow-2xl transition-all">
                <div className="md:w-1/2 h-[350px] relative overflow-hidden">
                  <img src={featured.image} alt={featured.name} className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-[#2FA084] shadow-xl">
                    FEATURED DESTINATION
                  </div>
                </div>
                <div className="md:w-1/2 p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-yellow-500 mb-6">
                      <Star size={18} fill="currentColor" />
                      <span className="text-slate-900 font-bold">{featured.rating} / 5.0</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">{featured.name}, {featured.country}</h2>
                    <p className="text-slate-500 text-lg leading-relaxed mb-8">{featured.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 text-xs font-black uppercase tracking-widest block mb-1">Starting from</span>
                      <span className="text-3xl font-black text-slate-900">${featured.price.toLocaleString()}</span>
                    </div>
                    <div className="p-5 bg-slate-950 text-white rounded-2xl group-hover:bg-[#2FA084] transition-all shadow-xl group-hover:-translate-y-2">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </a>
            )}

            {/* Category Tabs */}
            <div className="flex items-center gap-10 mb-12 border-b border-slate-100 overflow-x-auto pb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`relative text-lg font-black tracking-tight transition-all whitespace-nowrap ${activeCategory === cat ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {cat}
                  {activeCategory === cat && <div className="absolute -bottom-4 left-0 right-0 h-1 bg-[#2FA084] rounded-full" />}
                </button>
              ))}
            </div>

            {/* Destination Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  dest={dest}
                  wishlisted={wishlisted.has(dest.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-400 font-bold text-lg">No destinations match your filters.</p>
                <button type="button" onClick={() => { setActiveCategory('All'); setSearch('') }} className="mt-4 text-[#2FA084] font-black underline">Clear filters</button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-[#2FA084] rounded-2xl flex items-center justify-center text-white">
              <MapPin size={28} />
            </div>
            <span className="text-4xl font-black text-white tracking-tighter self-center">WanderLuxe</span>
          </div>
          <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed mb-10">Curating the world's most extraordinary journeys for the discerning explorer.</p>
          <div className="flex justify-center gap-10">
            {['Destinations', 'Experiences', 'About Us', 'Contact'].map((link) => (
              <a key={link} href="/destinations" className="text-slate-400 hover:text-white font-bold transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function DestinationCard({
  dest,
  wishlisted,
  onToggleWishlist,
}: {
  dest: Destination
  wishlisted: boolean
  onToggleWishlist: (e: React.MouseEvent, id: number) => void
}) {
  return (
    <a
      href={`/destinations/${dest.id}`}
      className="block bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-[#2FA084]/20 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group cursor-pointer hover:-translate-y-3"
    >
      <div className="relative h-[250px] overflow-hidden">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <button
          type="button"
          onClick={(e) => onToggleWishlist(e, dest.id)}
          className={`absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-90 ${wishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
        >
          <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-2 mb-4">
          <Star size={14} className="text-yellow-400" fill="currentColor" />
          <span className="text-xs font-black text-slate-900">{dest.rating}</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-[#2FA084] transition-colors uppercase tracking-tight">{dest.name}</h3>
        <div className="flex items-center gap-1 text-slate-400 mb-4">
          <MapPin size={12} />
          <span className="text-xs font-medium">{dest.country}</span>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
          <span className="text-xl font-black text-slate-900">${dest.price.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Per Person</span>
        </div>
      </div>
    </a>
  )
}
