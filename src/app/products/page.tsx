"use client";
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ShoppingCart, Search, Filter, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const products = [
    { id: 1, name: "Eco-Friendly Water Bottle", price: 24.99, category: "Kitchen", image: "/placeholder.svg" },
    { id: 2, name: "Organic Cotton T-Shirt", price: 34.99, category: "Clothing", image: "/placeholder.svg" },
    { id: 3, name: "Recycled Leather Wallet", price: 49.99, category: "Accessories", image: "/placeholder.svg" },
    { id: 4, name: "Bamboo Cutlery Set", price: 19.99, category: "Kitchen", image: "/placeholder.svg" },
    { id: 5, name: "Natural Fiber Backpack", price: 79.99, category: "Accessories", image: "/placeholder.svg" },
    { id: 6, name: "Sustainable Yoga Mat", price: 39.99, category: "Fitness", image: "/placeholder.svg" },
    { id: 7, name: "Reusable Produce Bags", price: 14.99, category: "Kitchen", image: "/placeholder.svg" },
    { id: 8, name: "Solar-Powered Lantern", price: 29.99, category: "Outdoor", image: "/placeholder.svg" },
]

export default function ProductShowcase() {
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 100])
    const [isFilterVisible, setIsFilterVisible] = useState(true)

    const toggleFilters = () => setIsFilterVisible(!isFilterVisible)

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "All" || product.category === categoryFilter) &&
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    return (
        <div className="flex flex-col min-h-screen bg-[#FAF7F0]">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#D8D2C2]">
                <Link className="flex items-center justify-center" href="#">
                    <ShoppingCart className="h-6 w-6 mr-2 text-[#B17457]" />
                    <span className="font-bold text-xl text-[#4A4947]">ShopEase</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium text-[#4A4947] hover:text-[#B17457] transition-colors" href="#">
                        Home
                    </Link>
                    <Link className="text-sm font-medium text-[#4A4947] hover:text-[#B17457] transition-colors" href="#">
                        About
                    </Link>
                    <Link className="text-sm font-medium text-[#4A4947] hover:text-[#B17457] transition-colors" href="#">
                        Contact
                    </Link>
                </nav>
            </header>
            <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-[#4A4947] mb-8">Our Products</h1>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="w-full md:w-64 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-[#B17457]" />
                                <h2 className="text-lg font-semibold text-[#4A4947]">Filters</h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="md:hidden"
                                onClick={toggleFilters}
                            >
                                {isFilterVisible ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                            </Button>
                        </div>
                        {isFilterVisible && (
                            <>
                                <Select onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-full bg-[#FAF7F0] border-[#D8D2C2] text-[#4A4947]">
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
                                    <label className="text-sm font-medium text-[#4A4947]">Price Range</label>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-[#4A4947]">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex-1 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B17457]" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-10 bg-[#FAF7F0] border-[#D8D2C2] text-[#4A4947]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={300}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 text-[#4A4947]">{product.name}</h3>
                                        <p className="text-[#4A4947]/80 mb-4">${product.price.toFixed(2)}</p>
                                        <Button className="w-full bg-[#B17457] text-[#FAF7F0] hover:bg-[#B17457]/90">
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <p className="text-center text-[#4A4947]">No products found. Try adjusting your filters.</p>
                        )}
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