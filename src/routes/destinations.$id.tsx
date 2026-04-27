import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useUser, SignInButton } from '@clerk/tanstack-react-start'
import { useState } from 'react'
import TravelNavbar from '#/components/TravelNavbar'
import { getDestination, createBooking, toggleWishlist, getWishlistIds } from '#/lib/travel-fns'
import { Star, MapPin, Clock, Thermometer, Calendar, Users, Heart, ArrowLeft, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/destinations/$id')({
  loader: async ({ params }) => {
    const id = Number(params.id)
    const [destination, wishlistIds] = await Promise.all([
      getDestination({ data: { id } }),
      getWishlistIds(),
    ])
    return { destination, wishlistIds }
  },
  component: DestinationDetail,
})

function DestinationDetail() {
  const { destination, wishlistIds } = Route.useLoaderData()
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const [wishlisted, setWishlisted] = useState(wishlistIds.includes(destination?.id ?? -1))
  const [showBooking, setShowBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [travelers, setTravelers] = useState(1)
  const [travelDate, setTravelDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Destination not found</h1>
          <button type="button" onClick={() => navigate({ to: '/destinations' })} className="px-8 py-3 bg-[#2FA084] text-white rounded-full font-bold">
            Back to Destinations
          </button>
        </div>
      </div>
    )
  }

  const highlights: string[] = JSON.parse(destination.highlights)
  const totalPrice = destination.price * travelers

  async function handleToggleWishlist() {
    const result = await toggleWishlist({ data: { destinationId: destination!.id } })
    setWishlisted(result.wishlisted)
  }

  async function handleBook() {
    if (!travelDate || !returnDate) return
    setIsSubmitting(true)
    try {
      await createBooking({
        data: { destinationId: destination!.id, travelDate, returnDate, travelers, totalPrice },
      })
      setBookingSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TravelNavbar />

      {/* Hero */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <button
          type="button"
          onClick={() => navigate({ to: '/destinations' })}
          className="absolute top-32 left-8 flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <div className="absolute bottom-12 left-8 right-8">
          <p className="text-[#6FCF97] font-black text-sm uppercase tracking-widest mb-2">{destination.category}</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2">
            {destination.name}
          </h1>
          <div className="flex items-center gap-2 text-white/70">
            <MapPin size={16} />
            <span className="font-medium">{destination.country}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-10">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Thermometer, label: 'Temperature', value: destination.temperature },
                { icon: Clock, label: 'Flight Time', value: `${destination.flightHours}h` },
                { icon: Calendar, label: 'Best Season', value: destination.bestSeason },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-sm">
                  <Icon size={24} className="mx-auto text-[#2FA084] mb-3" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-lg font-black text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-yellow-500 mb-4">
                <Star size={18} fill="currentColor" />
                <span className="font-black text-slate-900">{destination.rating} / 5.0</span>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed">{destination.longDescription}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Top Highlights</h2>
              <div className="grid grid-cols-2 gap-4">
                {highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#eaf7f2] rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle size={16} className="text-[#2FA084]" />
                    </div>
                    <span className="text-slate-700 font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl sticky top-32">
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Starting from</p>
              <p className="text-4xl font-black text-slate-900 mb-6">${destination.price.toLocaleString()}</p>

              {isSignedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowBooking(true)}
                    className="w-full py-4 bg-slate-950 hover:bg-[#2FA084] text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all mb-3 hover:-translate-y-0.5 shadow-lg"
                  >
                    Book Now
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 border-2 ${wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-100 text-slate-600 hover:border-red-200 hover:text-red-500'}`}
                  >
                    <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                    {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>
                </>
              ) : (
                <SignInButton mode="modal">
                  <button type="button" className="w-full py-4 bg-slate-950 hover:bg-[#2FA084] text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg">
                    Sign In to Book
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 w-full max-w-lg shadow-2xl">
            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Booking Confirmed!</h2>
                <p className="text-slate-500 mb-8">Your trip to {destination.name} is booked. Check My Trips to manage it.</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setShowBooking(false); setBookingSuccess(false) }} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-sm tracking-widest uppercase hover:border-slate-300 transition-all">
                    Close
                  </button>
                  <a href="/trips" className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black text-sm tracking-widest uppercase text-center hover:bg-[#2FA084] transition-all">
                    My Trips
                  </a>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Book {destination.name}</h2>
                <p className="text-slate-400 mb-8">{destination.country}</p>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Travel Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl font-medium focus:outline-none focus:border-[#2FA084] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={travelDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl font-medium focus:outline-none focus:border-[#2FA084] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Travelers</label>
                    <div className="flex items-center gap-4 border-2 border-slate-100 rounded-2xl px-5 py-4">
                      <Users size={20} className="text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={travelers}
                        onChange={(e) => setTravelers(Number(e.target.value))}
                        className="flex-1 font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between mb-6">
                  <span className="text-slate-400 font-medium">Total</span>
                  <span className="text-2xl font-black text-slate-900">${totalPrice.toLocaleString()}</span>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowBooking(false)} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-sm tracking-widest uppercase hover:border-slate-300 transition-all">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBook}
                    disabled={!travelDate || !returnDate || isSubmitting}
                    className="flex-1 py-4 bg-slate-950 hover:bg-[#2FA084] disabled:opacity-50 text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
