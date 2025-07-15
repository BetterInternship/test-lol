"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-[rgba(15,15,15,1)] py-1 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white lowercase">betterinternship</div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:opacity-70">
              Employers Log In
            </Button>
            <Button className="bg-white hover:bg-gray-200 text-black font-semibold">Start for free</Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-sm border-t border-gray-800">
            <a href="#solutions" className="block px-3 py-2 text-white hover:opacity-70 font-medium">
              Solutions
            </a>
            <a href="#pricing" className="block px-3 py-2 text-white hover:opacity-70 font-medium">
              Pricing
            </a>
            <a href="#resources" className="block px-3 py-2 text-white hover:opacity-70 font-medium">
              Resources
            </a>
            <a href="#enterprise" className="block px-3 py-2 text-white hover:opacity-70 font-medium">
              Enterprise
            </a>
            <a href="#whats-new" className="block px-3 py-2 text-white hover:opacity-70 font-medium">
              What's new
            </a>
            <div className="pt-4 pb-3 border-t border-gray-800">
              <Button variant="ghost" className="w-full text-left text-white hover:opacity-70">
                Log in
              </Button>
              <Button className="w-full mt-2 bg-white hover:bg-gray-200 text-black font-semibold">Start for free</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
