"use client"

import { useState, useRef, useEffect } from "react"
import { User, ChevronDown, LogOut, Settings, BookA, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/app/authctx"

export default function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthContext()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout({})
    setIsOpen(false)
    router.push('/')
  }

  const getUserDisplayName = () => {
    if (user?.fullName) {
      // Show first name and last initial
      const names = user.fullName.split(' ')
      if (names.length > 1) {
        return `${names[0]} ${names[names.length - 1].charAt(0)}.`
      }
      return names[0]
    }
    return 'User'
  }

  if (false) {
    return (
      <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md"></div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 h-10 px-4 bg-white border-gray-300 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-6 h-6 rounded-lg border-2 border-gray-400 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <span className="text-gray-700 font-medium">
          {isAuthenticated ? getUserDisplayName() : "Account"}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {isAuthenticated ? (
            <div className="py-1">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                onClick={() => {
                  setIsOpen(false)
                  router.push('/profile')
                }}
              >
                <Settings className="w-4 h-4" />
                Profile Settings
              </button>
              
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                onClick={() => {
                  setIsOpen(false)
                  router.push('/applications')
                }}
              >
                <BookA className="w-4 h-4" />
                Applications
              </button>

              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                onClick={() => {
                  setIsOpen(false)
                  router.push('/saved')
                }}
              >
                <Heart className="w-4 h-4" />
                Saved Jobs
              </button>
              
              <hr className="my-1 border-gray-200" />
              
              <button 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="py-1">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Please sign in to access your profile.</p>
              </div>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                onClick={() => {
                  setIsOpen(false)
                  router.push('/login')
                }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
