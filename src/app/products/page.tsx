"use client";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ShoppingCart, Search, Filter, X, ShoppingBagIcon, Dumbbell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { parseCookies } from 'nookies'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface Variant {
    _id: number;
    name: string;
    price: number;
}
export default function ProductShowcase() {
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 100])
    const [isFilterVisible, setIsFilterVisible] = useState(true)
    const [cartItemCount, setCartItemCount] = useState(0);
    const router = useRouter();
    type Product = {
        _id: string;
        title: string;
        price: number;
        mrpPrice: number;
        description: string;
        images: string[];
        creationAt: Date;
        updatedAt: Date;
        category: string;
        variant: [Variant]
    };

    const [products, setProducts] = useState<Product[]>([])
    const toggleFilters = () => setIsFilterVisible(!isFilterVisible)

    async function fetchProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/getProducts`);
            const data = await response.json();
            setProducts(data);
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async function fetchCart() {
        try {
            const cookies = parseCookies();
            const token = cookies['jwt'];
            const response = await fetch(`${API_BASE_URL}/cart/itemsCount`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCartItemCount(data.itemsCount);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }

    async function addToCart(productId: string) {
        try {
            const cookies = parseCookies();
            const token = cookies['jwt'];
            const response = await fetch(`${API_BASE_URL}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity: 1 })
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

    const filteredProducts = products.filter(product =>
        product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const parseImages = (images: string[], id: string) => {
        const image = `https://isf-p4u.s3.ap-south-1.amazonaws.com/${id}/${images[0]}`;
        console.log(image);
        return image;

    };

    useEffect(() => {
        fetchProducts().then((products) => {
            setProducts(products);
        });
        fetchCart();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#333333]">
                <Link className="flex items-center justify-center" href="#">
                    <Dumbbell className="h-6 w-6 mr-2 text-[#90FF00]" />
                    <span className="font-bold text-xl text-white">PROTEIN4U</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium text-white hover:text-[#90FF00] transition-colors" href="/cart">
                        <div className="relative">
                            <ShoppingBagIcon className="h-6 w-6" />
                            <span className="absolute -top-2 -right-2 bg-[#90FF00] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        </div>
                    </Link>
                </nav>
            </header>
            <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white mb-8">Our Products</h1>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="w-full md:w-64 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-[#90FF00]" />
                                <h2 className="text-lg font-semibold text-white">Filters</h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="md:hidden text-[#90FF00]"
                                onClick={toggleFilters}
                            >
                                {isFilterVisible ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                            </Button>
                        </div>
                        {isFilterVisible && (
                            <>
                                <Select onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-full bg-[#333333] border-[#90FF00] text-white">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Categories</SelectItem>
                                        <SelectItem value="Kitchen">Kitchen</SelectItem>
                                        <SelectItem value="Clothing">Clothing</SelectItem>
                                        <SelectItem value="Accessories">Accessories</SelectItem>
                                        <SelectItem value="Fitness">Fitness</SelectItem>
                                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Price Range</label>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-white">
                                        <span>₹{priceRange[0]}</span>
                                        <span>₹{priceRange[1]}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex-1 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90FF00]" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-10 bg-[#333333] border-[#90FF00] text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => {
                                const productImage = parseImages(product.images, product._id);
                                return (
                                    <div
                                        key={product._id}
                                        className="bg-[#333333] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => router.push(`/products/${product._id}`)}
                                    >
                                        <img
                                            src={productImage}
                                            alt={product.title}
                                            width={300}
                                            height={200}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2 text-white">{product.title}</h3>
                                            <p className="text-white/60 line-through text-sm">₹{product.mrpPrice}</p>
                                            <p className="text-white/80 mb-4">₹{product.price.toFixed(2)}</p>
                                            <Button
                                                className="w-full bg-[#90FF00] text-black hover:bg-[#90FF00]/90"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product._id);
                                                }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {filteredProducts.length === 0 && (
                            <p className="text-center text-white">No products found. Try adjusting your filters.</p>
                        )}
                    </div>
                </div>
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
        </div>
    )
}