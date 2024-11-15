'use client';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin,X,Phone,CheckCircle, Minus, Plus, ArrowRight, Trash, CreditCard, Lock, Dumbbell, Variable } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    variant: string;
}

function PaymentModal({ isOpen, onClose, total, onCheckout }: { isOpen: boolean; onClose: () => void; total: number; onCheckout: () => void }) {
    const [address,setAddress] = useState('');
    const [phoneNumber,setPhoneNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCheckout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black p-8 rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Order Confirmation</h2>
                    <Button onClick={onClose} variant="ghost" className="text-[#90FF00] hover:bg-[#333333] p-1">
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-white">Delivery Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90FF00]" />
                            <Input
                                id="address"
                                placeholder="123 Main St, City, Country"
                                className="pl-10 bg-[#333333] border-[#90FF00] text-white"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone-number" className="text-white">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90FF00]" />
                            <Input
                                id="phone-number"
                                placeholder="+1 234 567 8900"
                                className="pl-10 bg-[#333333] border-[#90FF00] text-white"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="bg-[#333333] p-4 rounded-lg">
                        <p className="text-white mb-2">Order Summary:</p>
                        <p className="text-[#90FF00] font-bold">Total: ₹{total.toFixed(2)}</p>
                    </div>
                    <Button type="submit" className="w-full bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                        <CheckCircle className="mr-2 h-4 w-4" /> Confirm Order
                    </Button>
                </form>
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
    const Payment = async () => {
        try {
            const transactionId = "Tr-" + uuidv4().toString().slice(-6);
            const response = await fetch("/api/payrequest", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    merchantTransactionId: transactionId,
                    merchantUserId: "MUID123",
                    mobileNumber: "9999999999",
                    amount: 1,
                })
            });
            const data = await response.json();
            window.open(
                data.data.instrumentResponse.redirectInfo.url,
                "_blank"
            );
        } catch (error) {
            console.error("Error making API request:", error);
        }
    };
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
                const items = data.items.map((item: any) => (
                    console.log(item), {
                        id: item.productId,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                        variant: item.variantId,
                        image: item.image
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

    async function QuantityToCart(productId: string, change: number, varaint: string) {
        try {
            const cookies = parseCookies();
            const token = cookies['jwt'];
            const response = await fetch(`${API_BASE_URL}/cart/setQuantity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity: change, varaintId: varaint })
            });
            if (!response.ok) {
                console.error('Error updating quantity:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }

    const parseImages = (id: string, image: string) => {
        const images = `https://isf-p4u.s3.ap-south-1.amazonaws.com/${id}/${image}`;
        return images;
    };

    const setQuantity = (id: string, change: number, variant: string) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
            )
        );
        QuantityToCart(id, change, variant);
    };

    const removeItem = async (id: string, variantId: string) => {
        try {
            const cookies = parseCookies();
            const token = cookies['jwt'];
            const response = await fetch(`${API_BASE_URL}/cart/remove`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: id, variantId: variantId })
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
            Payment();
            // const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`
            //     },
            //     body: JSON.stringify({ items: cartItems })
            // });
            // if (response.ok) {
            //     console.log('Checkout successful');
            //     router.push("/products")
            // } else {
            //     console.error('Error during checkout:', response.statusText);
            // }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal;

    if (isLoading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#333333]">
                <Link className="flex items-center justify-center" href="/">
                    <Dumbbell className="h-6 w-6 mr-2 text-[#90FF00]" />
                    <span className="font-bold text-xl text-white">PROTEIN4U</span>
                </Link>
            </header>
            <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>
                {cartItems.length === 0 ? (
                    <div className="text-center text-white">
                        <p className="mb-4">Your cart is empty.</p>
                        <Link href="/products">
                            <Button className="bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 bg-[#333333] p-4 rounded-lg shadow">
                                    <Image
                                        src={parseImages(item.id, item.image)}
                                        alt={item.title}
                                        width={80}
                                        height={80}
                                        className="rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{item.title}</h3>
                                        <p className="text-white/80">₹{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setQuantity(item.id, -1, item.variant)}
                                            disabled={item.quantity === 1}
                                            className="h-8 w-8 rounded-full border-[#90FF00] text-[#000000]"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setQuantity(item.id, 1, item.variant)}
                                            className="h-8 w-8 rounded-full border-[#90FF00] text-[#000000]"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(item.id, item.variant)}
                                        className="text-[#90FF00] hover:text-[#90FF00]/80"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#333333] p-6 rounded-lg shadow space-y-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                            <div className="flex justify-between text-white">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white font-semibold text-lg">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full bg-[#90FF00] text-black hover:bg-[#90FF00]/90"
                                onClick={() => setIsPaymentModalOpen(true)}
                            >
                                Proceed to Checkout
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </main>
            <footer className="w-full py-6 bg-[#333333]">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-white/60 mb-4 md:mb-0">© 2024 PROTEIN4U. All rights reserved.</p>
                        <nav className="flex gap-4">
                            <Link className="text-sm text-white/60 hover:text-[#90FF00]" href="#">
                                Terms of Service
                            </Link>
                            <Link className="text-sm text-white/60 hover:text-[#90FF00]" href="#">
                                Privacy Policy
                            </Link>
                            <Link className="text-sm text-white/60 hover:text-[#90FF00]" href="#">
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