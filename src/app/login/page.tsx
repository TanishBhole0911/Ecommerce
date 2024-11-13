"use client";
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Mail, Lock, User, Dumbbell } from 'lucide-react'
import Link from "next/link"
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AuthPage() {
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [signupName, setSignupName] = useState('')
    const [signupEmail, setSignupEmail] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const Router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: loginEmail,
                password: loginPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            Cookies.set('jwt', response.data.token);
            console.log('Login successful');
            Router.push("/products");
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, {
                username: signupName,
                password: signupPassword,
                email: signupEmail
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            Cookies.set('jwt', response.data.token);
            console.log('Signup successful');
            Router.push("/products");
        } catch (error) {
            console.error('Signup failed', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-[#333333]">
                <Link className="flex items-center justify-center" href="#">
                    <Dumbbell className="h-6 w-6 mr-2 text-[#90FF00]" />
                    <span className="font-bold text-xl text-white">PROTEIN4U</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium text-white hover:text-[#90FF00] transition-colors" href="/">
                        Home
                    </Link>
                    <Link className="text-sm font-medium text-white hover:text-[#90FF00] transition-colors" href="/about">
                        About
                    </Link>
                </nav>
            </header>
            <main className="flex-1 py-12 px-4 md:px-6 lg:px-8 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-[#333333]">
                            <TabsTrigger value="login" className="text-white data-[state=active]:bg-[#90FF00] data-[state=active]:text-black">Login</TabsTrigger>
                            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-[#90FF00] data-[state=active]:text-black">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email" className="text-white">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90FF00]" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="pl-10 bg-[#333333] border-[#90FF00] text-white"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password" className="text-white">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90FF00]" />
                                        <Input
                                            id="login-password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="pl-10 bg-[#333333] border-[#90FF00] text-white"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                                    Login
                                </Button>
                            </form>
                            <div className="mt-4 text-center">
                                <Link href="#" className="text-sm text-[#90FF00] hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name" className="text-white">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90FF00]" />
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="pl-10 bg-[#333333] border-[#90FF00] text-white"
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90FF00]" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="pl-10 bg-[#333333] border-[#90FF00] text-white"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90FF00]" />
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="Create a password"
                                            className="pl-10 bg-[#333333] border-[#90FF00] text-white"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-[#90FF00] text-black hover:bg-[#90FF00]/90">
                                    Sign Up
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <footer>
                <div className="px-4 md:px-6 w-full">
                    <div className="flex md:flex-row w-full">
                        <p className="text-sm text-white/60 mb-4 md:mb-0">© 2024 PROTEIN4U. All rights reserved.</p>
                        <nav className="flex gap-4 ml-auto">
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