import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const destinations = sqliteTable('destinations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  country: text('country').notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description').notNull(),
  price: real('price').notNull(),
  image: text('image').notNull(),
  rating: real('rating').notNull(),
  category: text('category').notNull(),
  temperature: text('temperature').notNull(),
  flightHours: real('flight_hours').notNull(),
  bestSeason: text('best_season').notNull(),
  highlights: text('highlights').notNull(), // JSON array string
})

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  destinationId: integer('destination_id').notNull().references(() => destinations.id),
  travelDate: text('travel_date').notNull(),
  returnDate: text('return_date').notNull(),
  travelers: integer('travelers').notNull().default(1),
  totalPrice: real('total_price').notNull(),
  status: text('status').notNull().default('confirmed'), // confirmed | cancelled
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const wishlist = sqliteTable('wishlist', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  destinationId: integer('destination_id').notNull().references(() => destinations.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const flights = sqliteTable('flights', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  airline: text('airline').notNull(),
  fromCode: text('from_code').notNull(),
  toCode: text('to_code').notNull(),
  fromCity: text('from_city').notNull(),
  toCity: text('to_city').notNull(),
  departure: text('departure').notNull(),
  arrival: text('arrival').notNull(),
  duration: text('duration').notNull(),
  price: real('price').notNull(),
  stops: integer('stops').notNull().default(0),
  stopsLabel: text('stops_label').notNull(),
  rating: real('rating').notNull(),
  features: text('features').notNull(), // JSON array string
  badge: text('badge'),
})

export type Destination = typeof destinations.$inferSelect
export type Booking = typeof bookings.$inferSelect
export type WishlistItem = typeof wishlist.$inferSelect
export type Flight = typeof flights.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type NewWishlistItem = typeof wishlist.$inferInsert
