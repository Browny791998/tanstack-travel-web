import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import TravelNavbar from '#/components/TravelNavbar'
import { getMyBookings, cancelBooking } from '#/lib/travel-fns'
import { MapPin, Calendar, Users, CheckCircle, XCircle, Plane } from 'lucide-react'

export const Route = createFileRoute('/trips')({
  loader: async () => getMyBookings(),
  component: TripsPage,
})

function TripsPage() {
  const initialBookings = Route.useLoaderData()
  const [bookings, setBookings] = useState(initialBookings)

  async function handleCancel(bookingId: number) {
    await cancelBooking({ data: { bookingId } })
    setBookings((prev) =>
      prev.map((b) => (b.booking.id === bookingId ? { ...b, booking: { ...b.booking, status: 'cancelled' } } : b)),
    )
  }

  const upcoming = bookings.filter((b) => b.booking.status === 'confirmed')
  const cancelled = bookings.filter((b) => b.booking.status === 'cancelled')

  return (
    <div className="min-h-screen bg-slate-50">
      <TravelNavbar />

      <div className="pt-36 pb-20 container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#eaf7f2] rounded-2xl flex items-center justify-center">
              <Plane size={24} className="text-[#2FA084]" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Trips</h1>
          </div>
          <p className="text-slate-400 font-medium ml-1">{upcoming.length} upcoming trip{upcoming.length !== 1 ? 's' : ''}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">No trips booked yet</h2>
            <p className="text-slate-400 mb-8">Find your next adventure and book a trip.</p>
            <a href="/destinations" className="inline-block px-10 py-4 bg-slate-950 text-white rounded-full font-black text-sm tracking-widest uppercase hover:bg-[#2FA084] transition-all">
              Explore Destinations
            </a>
          </div>
        ) : (
          <div className="space-y-12">
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-6">Upcoming</h2>
                <div className="space-y-4">
                  {upcoming.map(({ booking, destination }) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      destination={destination}
                      onCancel={() => handleCancel(booking.id)}
                    />
                  ))}
                </div>
              </section>
            )}
            {cancelled.length > 0 && (
              <section>
                <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-6">Cancelled</h2>
                <div className="space-y-4">
                  {cancelled.map(({ booking, destination }) => (
                    <BookingCard key={booking.id} booking={booking} destination={destination} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({
  booking,
  destination,
  onCancel,
}: {
  booking: { id: number; travelDate: string; returnDate: string; travelers: number; totalPrice: number; status: string }
  destination: { id: number; name: string; country: string; image: string; category: string }
  onCancel?: () => void
}) {
  const isCancelled = booking.status === 'cancelled'

  return (
    <div className={`bg-white rounded-3xl overflow-hidden border flex flex-col md:flex-row shadow-sm transition-all ${isCancelled ? 'opacity-60 border-slate-100' : 'border-slate-100 hover:shadow-lg'}`}>
      <div className="md:w-48 h-40 md:h-auto relative shrink-0">
        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
        {isCancelled && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <span className="text-white font-black text-xs uppercase tracking-widest">Cancelled</span>
          </div>
        )}
      </div>
      <div className="flex-1 p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{destination.name}</h3>
              <div className="flex items-center gap-1 text-slate-400 mt-1">
                <MapPin size={13} />
                <span className="text-sm font-medium">{destination.country}</span>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${isCancelled ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-600'}`}>
              {isCancelled ? <XCircle size={13} /> : <CheckCircle size={13} />}
              {isCancelled ? 'Cancelled' : 'Confirmed'}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={15} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Depart</p>
                <p className="text-sm font-bold text-slate-700">{booking.travelDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={15} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Return</p>
                <p className="text-sm font-bold text-slate-700">{booking.returnDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Users size={15} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Travelers</p>
                <p className="text-sm font-bold text-slate-700">{booking.travelers}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Paid</p>
            <p className="text-2xl font-black text-slate-900">${booking.totalPrice.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <a href={`/destinations/${destination.id}`} className="px-6 py-3 border-2 border-slate-100 rounded-2xl font-black text-sm text-slate-600 hover:border-[#2FA084] hover:text-[#2FA084] transition-all">
              View Dest.
            </a>
            {!isCancelled && onCancel && (
              <button type="button" onClick={onCancel} className="px-6 py-3 border-2 border-red-100 text-red-500 rounded-2xl font-black text-sm hover:bg-red-50 transition-all">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
