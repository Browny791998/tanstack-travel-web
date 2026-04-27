import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/tanstack-react-start'
import { Link } from '@tanstack/react-router'
import { Map as MapIcon } from 'lucide-react'

export default function TravelNavbar() {
  const { isSignedIn } = useUser()

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6 md:px-12 pointer-events-none flex justify-center">
      <nav className="w-full max-w-6xl h-20 bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-between px-10 pointer-events-auto shadow-2xl">
        {/* Logo */}
        <Link to="/travel" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/30">
            <MapIcon size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Wanderlust Travel</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/travel" className="text-white/80 hover:text-white font-medium transition-all hover:scale-105">Home</Link>
          <Link to="/destinations" className="text-white/80 hover:text-white font-medium transition-all hover:scale-105">Destinations</Link>
          <Link to="/flights" className="text-white/80 hover:text-white font-medium transition-all hover:scale-105">Flights</Link>
          {isSignedIn && (
            <>
              <a href="/wishlist" className="text-white/80 hover:text-white font-medium transition-all hover:scale-105">Wishlist</a>
              <a href="/trips" className="text-white/80 hover:text-white font-medium transition-all hover:scale-105">My Trips</a>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <button type="button" className="text-white font-bold hover:text-[#6FCF97] transition-colors px-4 py-2">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button type="button" className="bg-white text-[#2FA084] font-bold px-8 py-3 rounded-full hover:bg-[#eaf7f2] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
