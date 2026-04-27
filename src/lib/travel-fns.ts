import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { db } from '#/db'
import { bookings, wishlist, destinations, flights } from '#/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

export const getDestinations = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(destinations).all()
})

export const getFlights = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(flights).all()
})

export const getDestination = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const [dest] = db.select().from(destinations).where(eq(destinations.id, data.id)).all()
    return dest ?? null
  })

export const getWishlist = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return []
  return db
    .select({ wishlist, destination: destinations })
    .from(wishlist)
    .innerJoin(destinations, eq(wishlist.destinationId, destinations.id))
    .where(eq(wishlist.userId, userId))
    .all()
})

export const toggleWishlist = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ destinationId: z.number() }))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Not authenticated')
    const existing = db
      .select()
      .from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.destinationId, data.destinationId)))
      .get()
    if (existing) {
      db.delete(wishlist).where(eq(wishlist.id, existing.id)).run()
      return { wishlisted: false }
    }
    db.insert(wishlist).values({ userId, destinationId: data.destinationId }).run()
    return { wishlisted: true }
  })

export const getWishlistIds = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return []
  return db
    .select({ destinationId: wishlist.destinationId })
    .from(wishlist)
    .where(eq(wishlist.userId, userId))
    .all()
    .map((r) => r.destinationId)
})

export const createBooking = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      destinationId: z.number(),
      travelDate: z.string(),
      returnDate: z.string(),
      travelers: z.number().min(1).max(20),
      totalPrice: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Not authenticated')
    const result = db
      .insert(bookings)
      .values({ ...data, userId, status: 'confirmed' })
      .run()
    return { id: result.lastInsertRowid }
  })

export const getMyBookings = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return []
  return db
    .select({ booking: bookings, destination: destinations })
    .from(bookings)
    .innerJoin(destinations, eq(bookings.destinationId, destinations.id))
    .where(eq(bookings.userId, userId))
    .all()
})

export const cancelBooking = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ bookingId: z.number() }))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Not authenticated')
    db.update(bookings)
      .set({ status: 'cancelled' })
      .where(and(eq(bookings.id, data.bookingId), eq(bookings.userId, userId)))
      .run()
    return { success: true }
  })
