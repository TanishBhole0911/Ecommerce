'use client';
import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Minus, Plus, X, ArrowRight, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { title } from 'process';

interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCart() {
            try {
                const cookies = parseCookies();
                const token = cookies['jwt'];
                const response = await fetch('http://localhost:5000/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                const items = data.items.map((item: any) => ({
                    id: item.productId._id,
                    title: item.productId.title,
                    price: item.productId.price,
                    quantity: item.quantity,
                    image: item.productId.images[0]
                }));
                console.log(items);
                setCartItems(items);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching cart:', error);
                setIsLoading(false);
            }
        }

        fetchCart();
    }, []);
    async function QuantityToCart(productId: number, change: number) {
        try {
            const cookies = parseCookies();
            const token = cookies['jwt']; // Get JWT from cookies
            const response = await fetch('http://localhost:5000/cart/setQuantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity: change })
            });
            if (response.ok) {
            } else {
                console.error('Error adding to cart:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }


    const parseImages = (images: string) => {
        const urlMatch = images.match(/https?:\/\/[^\\\s"']+/);
        if (urlMatch) {
            const Parsed = "/" + urlMatch[0];
            return Parsed;
        }
        return "";
    };

    const setQuantity = (id: number, change: number) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
            )
        );
        QuantityToCart(id, change);

    };

    const removeItem = async (id: number) => {
        try {
            const cookies = parseCookies();
            const token = cookies['jwt'];
            const response = await fetch(`http://localhost:5000/cart/remove/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setCartItems(prevItems => prevItems.filter(item => item.id !== id));
            } else {
                console.error('Error removing item from cart:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax
    const total = subtotal + tax;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#FAF7F0]">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#D8D2C2]">
                <Link className="flex items-center justify-center" href="/">
                    <ShoppingCart className="h-6 w-6 mr-2 text-[#B17457]" />
                    <span className="font-bold text-xl text-[#4A4947]">ShopEase</span>
                </Link>
            </header>
            <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-[#4A4947] mb-8">Your Cart</h1>
                {cartItems.length === 0 ? (
                    <div className="text-center text-[#4A4947]">
                        <p className="mb-4">Your cart is empty.</p>
                        <Link href="/products">
                            <Button className="bg-[#B17457] text-[#FAF7F0] hover:bg-[#B17457]/90">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            {cartItems.map((item, _) => (
                                <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                                    <Image
                                        src={parseImages(item.image)}
                                        alt={item.title}
                                        width={80}
                                        height={80}
                                        className="rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[#4A4947]">{item.title}</h3>
                                        <p className="text-[#4A4947]/80">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setQuantity(item.id, -1)}
                                            disabled={item.quantity === 1}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setQuantity(item.id, 1)}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(item.id)}
                                        className="text-[#B17457] hover:text-[#B17457]/80"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow space-y-4">
                            <h2 className="text-xl font-semibold text-[#4A4947] mb-4">Order Summary</h2>
                            <div className="flex justify-between text-[#4A4947]">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#4A4947]">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#4A4947] font-semibold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <Button className="w-full bg-[#B17457] text-[#FAF7F0] hover:bg-[#B17457]/90">
                                Proceed to Checkout
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
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
    );
}