"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const pathname = usePathname();

    if (pathname === "/login") return null;

    return (
        <div className="fixed top-0 inset-x-0 z-50 flex justify-center p-4">
            <nav className="w-full max-w-5xl rounded-2xl border border-gray-300/80 bg-white/95 backdrop-blur-xl shadow-xl shadow-gray-200/40 px-6 py-3 flex items-center justify-between transition-all duration-300">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-gray-900 duration-200 hover:opacity-80">
                    <img src="/logo.jpg" alt="RECOVERY LOG" className="h-10 w-10 rounded-lg object-contain border border-gray-100 shadow-sm" />
                    <span className="hidden sm:inline-block font-mono tracking-widest text-lg">RECOVERY LOG</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {[
                        { name: "Home", path: "/" },
                        { name: "About", path: "/about" },
                        { name: "Courses", path: "/courses" },
                        { name: "Contact", path: "/contact" }
                    ].map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-100/50"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {session && session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
                        <Link href="/admin" className="ml-2 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-full transition-colors">
                            Admin Panel
                        </Link>
                    ) : session && (
                        <Link href="/dashboard" className="ml-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100/50 px-4 py-2 rounded-full transition-colors">
                            Dashboard
                        </Link>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                    {session ? (
                        <div className="flex items-center gap-3">
                            <Link href="/profile" className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
                                {session.user?.image && (
                                    <img
                                        src={session.user.image}
                                        alt="User"
                                        referrerPolicy="no-referrer"
                                        className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                                    />
                                )}
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login">
                            <button
                                className="rounded-full bg-black px-5 py-2 text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                            >
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="absolute top-20 inset-x-4 p-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-200 md:hidden">
                    <Link href="/" onClick={() => setIsOpen(false)} className="p-3 hover:bg-gray-50 rounded-xl text-gray-700 font-medium">Home</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className="p-3 hover:bg-gray-50 rounded-xl text-gray-700 font-medium">About</Link>
                    <Link href="/courses" onClick={() => setIsOpen(false)} className="p-3 hover:bg-gray-50 rounded-xl text-gray-700 font-medium">Courses</Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className="p-3 hover:bg-gray-50 rounded-xl text-gray-700 font-medium">Contact</Link>
                    {session ? (
                        <div className="border-t border-gray-100 mt-2 pt-2">
                            <Link href="/profile" onClick={() => setIsOpen(false)} className="block p-3 hover:bg-gray-50 rounded-xl text-gray-700 font-medium">Profile Settings</Link>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block p-3 hover:bg-gray-50 rounded-xl text-gray-700 font-medium">Dashboard</Link>
                            <button onClick={() => signOut()} className="w-full text-left p-3 hover:bg-red-50 text-red-600 rounded-xl font-medium">Sign Out</button>
                        </div>
                    ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)} className="mt-2 block w-full bg-black text-white text-center py-3 rounded-xl font-bold">Sign In</Link>
                    )}
                </div>
            )}
        </div>
    );
}
