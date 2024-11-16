'use client';
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Star, Truck, CreditCard, ArrowRight, Dumbbell, X } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { parseCookies, setCookie } from 'nookies'
import { useRouter } from 'next/navigation';

interface UserDetails {
  name: string;
  email: string;
  age: string;
}

async function saveEmail(details: UserDetails) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/saveEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    throw new Error('Failed to save email');
  }

  return response.json();
}

function Modal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (details: UserDetails) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    const cookies = parseCookies();
    const storedDetails = cookies['userDetails'];
    if (storedDetails) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const details = { name, email, age };
    try {
      await saveEmail(details);
      onSubmit(details);
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#333333] p-8 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Welcome to PROTEIN4U</h2>
          <Button variant="ghost" onClick={onClose} className="text-white hover:text-[#90FF00]">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-white mb-4">Please provide some details to continue:</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black text-white border-[#90FF00]"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black text-white border-[#90FF00]"
              required
            />
          </div>
          <div>
            <Label htmlFor="age" className="text-white">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="bg-black text-white border-[#90FF00]"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies['jwt'];
    setUserId(token);

    const storedDetails = cookies['userDetails'];
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
      setShowModal(false);
    }
  }, []);

  const handleModalSubmit = (details: UserDetails) => {
    setUserDetails(details);
    
    setCookie(null, 'userDetails', JSON.stringify(details), {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    setShowModal(false);
  };

  if (showModal) {
    return <Modal isOpen={showModal} onClose={() => { }} onSubmit={handleModalSubmit} />;
  }

  const handleBrowseProducts = () => {
    const router = useRouter();
    router.push('/products'); // Redirects to /products
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Dumbbell className="h-6 w-6 mr-2 text-[#90FF00]" />
          <span className="font-bold text-xl text-white">PROTEIN4U</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {userId ? (
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
          ) : (
            <Link className="text-sm font-medium hover:underline underline-offset-4 text-white" href="/login">
              Login
            </Link>
          )}
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
              <Button size="lg" variant="outline" className="text-[#90FF00] border-[#90FF00] hover:bg-[#90FF00] hover:text-black" onClick={handleBrowseProducts}>
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