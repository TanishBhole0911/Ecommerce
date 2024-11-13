'use client';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Star, Truck, CreditCard, ArrowRight, Dumbbell } from "lucide-react"
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
          {userId ?
            (
              <>
                <Link className="text-sm font-medium hover:underline underline-offset-4 text-white" href="#">
                  Products
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4 text-white" href="#">
                  About
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4 text-white" href="#">
                  Contact
                </Link>
              </>
            ) :
            (
              <>
                <Link className="text-sm font-medium hover:underline underline-offset-4 text-white" href="/login">
                  Login
                </Link>
              </>
            )
          }
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black mx-auto">
          <div className="container px-4 md:px-6 mx-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Premium Nutrition For Peak Performance
                  </h1>
                  <p className="max-w-[600px] text-white md:text-xl mt-5 mb-2">
                    Fuel your workouts with our premium protein supplements. Scientifically formulated for maximum results.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                  <Button size="lg" className="bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                    Shop Now
                  </Button>
                  <Button size="lg" variant="outline" className="text-[#000000] border-[#90FF00] hover:bg-[#90FF00] hover:text-black">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#333333] ">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Why Choose PROTEIN4U?</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Star, title: "Quality Products", description: "Curated selection of top-notch items" },
                { icon: Truck, title: "Fast Delivery", description: "Get your orders quickly and efficiently" },
                { icon: CreditCard, title: "Secure Payments", description: "Shop with confidence using our safe payment methods" },
                { icon: ShoppingCart, title: "Easy Returns", description: "Hassle-free return policy for your peace of mind" },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <feature.icon className="h-12 w-12 mb-4 text-[#90FF00]" />
                  <h3 className="font-bold text-xl mb-2 text-white">{feature.title}</h3>
                  <p className="text-white">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Featured Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Wireless Earbuds", price: "$99.99", image: "/placeholder.svg" },
                { name: "Smart Watch", price: "$199.99", image: "/placeholder.svg" },
                { name: "Laptop Backpack", price: "$59.99", image: "/placeholder.svg" },
                { name: "4K Action Camera", price: "$249.99", image: "/placeholder.svg" },
              ].map((product, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Image
                    alt={product.name}
                    className="aspect-square object-cover rounded-lg overflow-hidden mb-4"
                    height="200"
                    src={product.image}
                    width="200"
                  />
                  <h3 className="font-bold text-lg mb-2 text-white">{product.name}</h3>
                  <p className="text-white mb-4">{product.price}</p>
                  <Button className="bg-[#90FF00] text-black hover:bg-[#90FF00]/90">Add to Cart</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#333333]">
          <div className="container px-4 md:px-6 text-center mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="max-w-[600px] text-white md:text-xl mx-auto mb-8">
              Join thousands of satisfied customers and experience the best in online shopping with PROTEIN4U.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Button size="lg" className="bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                Create an Account
              </Button>
              <Button size="lg" variant="outline" className="text-[#90FF00] border-[#90FF00] hover:bg-[#90FF00] hover:text-black">
                Browse Products
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              Subscribe to Our Newsletter
            </h2>
            <div className="max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="Enter your email" className="flex-1 bg-black text-white border-white" />
                <Button type="submit" className="bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4 text-black" />
                </Button>
              </form>
              <p className="text-sm text-white mt-4 text-center">
                Stay updated with our latest products, deals, and shopping tips. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white">
        <p className="text-xs text-white">© 2024 PROTEIN4U. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-white" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-white" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}