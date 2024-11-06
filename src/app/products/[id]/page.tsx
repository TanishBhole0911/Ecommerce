'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Minus, Plus, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { parseCookies } from 'nookies'
import { ShoppingBagIcon } from 'lucide-react'

interface Product {
    _id: number
    title: string
    description: string
    price: number
    images: Array<string>
    rating: 3.5
}

export default function ProductDetailPage() {
    const [quantity, setQuantity] = useState(1)
    const [product, setProduct] = useState<Product | null>(null)
    const { id } = useParams()
    const [cartItemCount, setCartItemCount] = useState(0)

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5000/products/${id}`)
                .then(response => response.json())
                .then(data => setProduct(data))
                .catch(error => console.error('Error fetching product:', error))
        }
    }, [id])
    async function fetchCart() {
        try {
            const cookies = parseCookies();
            const token = cookies['jwt']; // Get JWT from cookies
            const response = await fetch('http://localhost:5000/cart/itemsCount', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCartItemCount(data.itemsCount); // Assuming the API returns totalItems
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }
    const incrementQuantity = () => setQuantity(q => q + 1)
    const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1))
    async function addToCartPost(productId: number, quantity: number) {
        try {
            const cookies = parseCookies();
            const token = cookies['jwt']; // Get JWT from cookies
            const response = await fetch('http://localhost:5000/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity: quantity })
            });
            if (response.ok) {
                fetchCart();
            } else {
                console.error('Error adding to cart:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }
    const addToCart = () => {
        if (product) {
            addToCartPost(product._id, quantity);
        }
    }

    if (!product) {
        return <div>Loading...</div>
    }
    const parseImages = (images: string) => {
        const urlMatch = images.match(/https?:\/\/[^\\\s"']+/);
        const Parsed = urlMatch ? "/" + urlMatch[0] : "";
        return Parsed;
    };
    useEffect(() => {
        fetchCart();
    }, []);
    return (
        <div className="flex flex-col min-h-screen bg-[#FAF7F0]">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#D8D2C2]">
                <Link className="flex items-center justify-center" href="#">
                    <ShoppingCart className="h-6 w-6 mr-2 text-[#B17457]" />
                    <span className="font-bold text-xl text-[#4A4947]">ShopEase</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium text-[#4A4947] hover:text-[#B17457] transition-colors" href="/cart">
                        <div className="relative">
                            <ShoppingBagIcon className="h-6 w-6" />

                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        </div>
                    </Link>
                </nav>
            </header>
            <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <Image
                                src={parseImages(product.images[0])}
                                alt={product.title}
                                width={500}
                                height={500}
                                className="w-full rounded-lg overflow-hidden"
                            />
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(product.rating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                                <span className="text-sm text-[#4A4947] ml-2">{product.rating} out of 5 stars</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold text-[#4A4947]">{product.title}</h1>
                            <p className="text-xl font-semibold text-[#B17457]">${product.price.toFixed(2)}</p>
                            <p className="text-[#4A4947]">{product.description}</p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={decrementQuantity}
                                        disabled={quantity === 1}
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={incrementQuantity}
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    onClick={addToCart}
                                    className="bg-[#B17457] text-[#FAF7F0] hover:bg-[#B17457]/90"
                                >
                                    Add to Cart
                                </Button>
                            </div>
                            <div className="border-t border-[#D8D2C2] pt-6">
                                <h2 className="text-lg font-semibold text-[#4A4947] mb-4">Product Details</h2>
                                <ul className="list-disc list-inside space-y-2 text-[#4A4947]">
                                    <li>Eco-friendly materials</li>
                                    <li>BPA-free</li>
                                    <li>Keeps drinks cold for up to 24 hours</li>
                                    <li>500ml capacity</li>
                                    <li>Dishwasher safe</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="w-full py-6 bg-[#D8D2C2]">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-[#4A4947]/60 mb-4 md:mb-0">© 2024 ShopEase. All rights reserved.</p>
                        <nav className="flex gap-4">
                            <Link className="text-sm text-[#4A4947]/60 hover:text-[#B17457]" href="#">
                                Terms of Service
                            </Link>
                            <Link className="text-sm text-[#4A4947]/60 hover:text-[#B17457]" href="#">
                                Privacy Policy
                            </Link>
                            <Link className="text-sm text-[#4A4947]/60 hover:text-[#B17457]" href="#">
                                Contact Us
                            </Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    )
}