"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Star, Truck, CreditCard, ArrowRight, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import "./index.css"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F0]">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#D8D2C2]">
        <Link className="flex items-center justify-center" href="#">
          <ShoppingCart className="h-6 w-6 mr-2 text-[#B17457]" />
          <span className="font-bold text-xl text-[#4A4947]">ShopEase</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="bg w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#D8D2C2] ">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#FAF7F0]">
                    Discover Natural Elegance
                  </h1>
                  <p className="max-w-[600px] text-[#FAF7F0] md:text-xl">
                    Explore our curated collection of sustainable and stylish products. Elevate your lifestyle with ShopEase.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                  <Button size="lg" className="bg-[#B17457] text-[#FAF7F0] hover:bg-[#B17457]/90" onClick={() => {
                    router.push("/products")
                  }}>
                    Shop Now
                  </Button>
                  <Button size="lg" variant="outline" className="text-[#B17457] border-[#B17457] hover:bg-[#B17457] hover:text-[#FAF7F0]">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 ">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-[#4A4947]">
              Why Choose ShopEase?
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Star, title: "Quality Products", description: "Curated selection of premium items" },
                { icon: Truck, title: "Fast Delivery", description: "Quick and efficient shipping" },
                { icon: CreditCard, title: "Secure Payments", description: "Safe and easy transaction process" },
                { icon: ShoppingCart, title: "Easy Returns", description: "Hassle-free return policy" },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <feature.icon className="h-12 w-12 mb-4 text-[#B17457]" />
                  <h3 className="font-semibold text-lg mb-2 text-[#4A4947]">{feature.title}</h3>
                  <p className="text-[#4A4947]/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#D8D2C2]">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-[#4A4947]">
              Featured Products
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Eco-Friendly Water Bottle", price: "$24.99", image: "/water-Bottle.jpg" },
                { name: "Organic Cotton T-Shirt", price: "$34.99", image: "/organic-tshirt.jpg" },
                { name: "Leather Jacket", price: "$49.99", image: "/Jacket.jpg" },
                { name: "Bamboo Cutlery Set", price: "$19.99", image: "/Cutlery-set.jpg" },
              ].map((product, index) => (
                <div key={index} className="flex flex-col items-center bg-[#FAF7F0] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Image
                    alt={product.name}
                    className="object-contain w-full h-48 mix-blend-multiply mt-4"
                    height="200"
                    src={product.image}
                    width="300"
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg mb-2 text-[#4A4947]">{product.name}</h3>
                    <p className="text-[#4A4947]/80 mb-4">{product.price}</p>
                    <Button className="bg-[#B17457] text-[#FAF7F0] hover:bg-[#B17457]/90">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#B17457]">
          <div className="container px-4 md:px-6 text-center mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#FAF7F0] mb-6">
              Ready to Embrace Sustainable Shopping?
            </h2>
            <p className="max-w-[600px] text-[#FAF7F0]/90 md:text-xl mx-auto mb-8">
              Join our community of conscious consumers and make a positive impact with every purchase.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Button size="lg" className="bg-[#FAF7F0] text-[#B17457] hover:bg-[#FAF7F0]/90">
                Create an Account
              </Button>
              <Button size="lg" variant="outline" className="bg-[#D8D2C2] text-[#4A4947] border-[#D8D2C2] hover:bg-[#FAF7F0] hover:text-[#B17457]">
                Browse Products
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-[#4A4947]">
              Stay Connected
            </h2>
            <div className="max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="Enter your email" className="flex-1 bg-[#FAF7F0] border-[#D8D2C2] text-[#4A4947]" />
                <Button type="submit" className="bg-[#B17457] text-[#FAF7F0] hover:bg-[#B17457]/90">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="text-sm text-[#4A4947]/80 mt-4 text-center">
                Stay updated with our latest products, eco-friendly tips, and exclusive offers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-[#D8D2C2]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#4A4947]">Shop</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">New Arrivals</Link></li>
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">Best Sellers</Link></li>
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">Eco-Friendly</Link></li>
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">All Products</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#4A4947]">About</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">Our Story</Link></li>
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">Sustainability</Link></li>
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">Press</Link></li>
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#4A4947]">Support</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">FAQ</Link></li>
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">Shipping</Link></li>
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">Returns</Link></li>
                <li><Link href="#" className="text-sm text-[#4A4947]/80 hover:text-[#B17457]">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#4A4947]">Connect</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-[#4A4947] hover:text-[#B17457]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-[#4A4947] hover:text-[#B17457]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218  2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-[#4A4947] hover:text-[#B17457]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-[#4A4947]/20 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-[#4A4947]/60">© 2024 ShopEase. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
              <Link className="text-xs text-[#4A4947]/60 hover:text-[#B17457]" href="#">
                Terms of Service
              </Link>
              <Link className="text-xs text-[#4A4947]/60 hover:text-[#B17457]" href="#">
                Privacy Policy
              </Link>
              <Link className="text-xs text-[#4A4947]/60 hover:text-[#B17457]" href="#">
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}