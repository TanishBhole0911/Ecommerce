'use client';
import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Minus, Plus, ArrowRight, Trash, CreditCard, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

function PaymentModal({ isOpen, onClose, total, onCheckout }: { isOpen: boolean; onClose: () => void; total: number; onCheckout: () => void }) {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically process the payment
        console.log('Processing payment:', { cardNumber, cardName, expiryDate, cvv });
        onCheckout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#FAF7F0] p-8 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-[#4A4947] mb-6">Payment Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B17457]" />
                            <Input
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                                className="pl-10 bg-[#FAF7F0] border-[#D8D2C2] text-[#4A4947]"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="card-name">Name on Card</Label>
                        <Input
                            id="card-name"
                            placeholder="John Doe"
                            className="bg-[#FAF7F0] border-[#D8D2C2] text-[#4A4947]"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry-date">Expiry Date</Label>
                            <Input
                                id="expiry-date"
                                placeholder="MM/YY"
                                className="bg-[#FAF7F0] border-[#D8D2C2] text-[#4A4947]"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B17457]" />
                                <Input
                                    id="cvv"
                                    placeholder="123"
                                    className="pl-10 bg-[#FAF7F0] border-[#D8D2C2] text-[#4A4947]"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-[#B17457] text-[#FAF7F0] hover:bg-[#B17457]/90">
                        Pay ${total.toFixed(2)}
                    </Button>
                </form>
                <Button onClick={onClose} variant="ghost" className="mt-4 w-full">
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const router = useRouter();

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        async function fetchCart() {
            try {
                const cookies = parseCookies();
                const token = cookies['jwt'];
                const response = await fetch(`${API_BASE_URL}/cart`, {
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
            const token = cookies['jwt'];
            const response = await fetch(`${API_BASE_URL}/cart/setQuantity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity: change })
            });
            if (response.ok) {
                // Handle successful quantity update
            } else {
                console.error('Error updating quantity:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
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
            const response = await fetch(`${API_BASE_URL}/cart/remove/${id}`, {
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

    const checkout = async () => {
        try {
            const cookies = parseCookies();
            const token = cookies['jwt'];
            const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: cartItems })
            });
            if (response.ok) {
                console.log('Checkout successful');
                router.push("/products")
            } else {
                console.error('Error during checkout:', response.statusText);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
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
                            {cartItems.map((item) => (
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
                            <Button
                                className="w-full bg-[#B17457] text-[#FAF7F0] hover:bg-[#B17457]/90"
                                onClick={() => setIsPaymentModalOpen(true)}
                            >
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
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                total={total}
                onCheckout={checkout}
            />
        </div>
    );
}