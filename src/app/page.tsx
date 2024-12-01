'use client'

import { Button } from "@/components/ui/button"
import { Dumbbell, User } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { parseCookies } from 'nookies'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const cookies = parseCookies()
    const token = cookies['jwt']
    setUserId(token)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Dumbbell className="h-6 w-6 mr-2 text-[#90FF00]" />
          <span className="font-bold text-xl text-white">PROTEIN4U</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {userId ? (
            <Link className="text-sm font-medium hover:underline underline-offset-4 text-white" href="/dashboard">
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <Link className="text-sm font-medium hover:underline underline-offset-4 text-white" href="/login">
              Login
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">PROTEIN4U</h1>
          <div className="mb-4">
            <Image
              src="/placeholder.svg"
              alt="PROTEIN4U Logo"
              width={200}
              height={200}
              className="mx-auto rounded-full"
            />
          </div>
          <p className="text-[#90FF00]">By: Deepesh Bairagi</p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Products:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-[#333333] rounded-lg p-4 hover:border hover:border-[#90FF00] transition-all">
                <Image
                  src="/placeholder.svg"
                  alt={`Product ${item}`}
                  width={200}
                  height={200}
                  className="w-full h-auto rounded-md mb-2"
                />
                <h3 className="text-white font-medium">Product {item}</h3>
                <p className="text-[#90FF00]">₹999.99</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Services:</h2>
          <div className="grid gap-4 max-w-md mx-auto">
            <div className="bg-[#333333] p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-white mb-2">Workout Plan</h3>
              <p className="text-[#90FF00] text-2xl font-bold mb-4">₹2k</p>
              <Button className="w-full bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                Get Started
              </Button>
            </div>
            <div className="bg-[#333333] p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-white mb-2">Diet Plan</h3>
              <p className="text-[#90FF00] text-2xl font-bold mb-4">₹2k</p>
              <Button className="w-full bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                Get Started
              </Button>
            </div>
            <div className="bg-[#333333] p-6 rounded-lg text-center border border-[#90FF00]">
              <h3 className="text-xl font-bold text-white mb-2">Complete Package</h3>
              <p className="text-[#90FF00] text-2xl font-bold mb-4">₹3k</p>
              <Button className="w-full bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                Get Both
              </Button>
            </div>
          </div>
        </section>

        <section className="text-center">
          <Link
            href="https://wordpress.com"
            className="inline-block bg-[#90FF00] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#90FF00]/90 transition-colors"
          >
            Visit Our Blog
          </Link>
        </section>
      </main>
      <footer className="py-6 px-4 border-t border-[#333333]">
        <p className="text-center text-sm text-white">
          © 2024 PROTEIN4U. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

