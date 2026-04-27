import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import TravelNavbar from '#/components/TravelNavbar'
import { getWishlist, toggleWishlist } from '#/lib/travel-fns'
import { Heart, MapPin, Star, ArrowRight, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/wishlist')({
  loader: async () => {
    const items = await getWishlist()
    return items
  },
  component: WishlistPage,
})

function WishlistPage() {
  const initialItems = Route.useLoaderData()
  const [items, setItems] = useState(initialItems)

  async function handleRemove(destinationId: number) {
    await toggleWishlist({ data: { destinationId } })
    setItems((prev) => prev.filter((i) => i.destination.id !== destinationId))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TravelNavbar />

      <div className="pt-36 pb-20 container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
              <Heart size={24} className="text-red-500" fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
          </div>
          <p className="text-slate-400 font-medium ml-1">{items.length} saved destination{items.length !== 1 ? 's' : ''}</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">No saved destinations yet</h2>
            <p className="text-slate-400 mb-8">Browse destinations and tap the heart to save your favourites.</p>
            <a href="/destinations" className="inline-block px-10 py-4 bg-slate-950 text-white rounded-full font-black text-sm tracking-widest uppercase hover:bg-[#2FA084] transition-all">
              Explore Destinations
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map(({ destination }) => (
              <div key={destination.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="relative h-52 overflow-hidden">
                  <img src={destination.image} alt={destination.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <button
                    type="button"
                    onClick={() => handleRemove(destination.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 shadow-lg transition-all hover:scale-110"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 text-yellow-400 mb-2">
                    <Star size={13} fill="currentColor" />
                    <span className="text-xs font-black text-slate-900">{destination.rating}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">{destination.name}</h3>
                  <div className="flex items-center gap-1 text-slate-400 mb-4">
                    <MapPin size={13} />
                    <span className="text-sm font-medium">{destination.country}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xl font-black text-slate-900">${destination.price.toLocaleString()}</span>
                    <a
                      href={`/destinations/${destination.id}`}
                      className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white hover:bg-[#2FA084] transition-colors"
                    >
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
