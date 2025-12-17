"use client";

import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Premium Branding (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Rich Gradient Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-black to-black opacity-90" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ backgroundSize: '40px 40px', opacity: 0.1 }} />
                </div>

                <div className="relative z-10 text-center px-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 inline-block"
                    >
                        <div className="p-4 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl">
                            <img src="/logo.jpg" alt="Logo" className="w-32 h-32 rounded-2xl shadow-lg" />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-4xl font-bold text-white mb-6 tracking-tight leading-tight"
                    >
                        Master Your <br />
                        <span className="text-blue-500">Digital Recovery</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed"
                    >
                        Join thousands of creators reclaiming their presence. Secure, verified, and expert-led.
                    </motion.p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 lg:px-24 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Header (Visible only on small screens) */}
                    <div className="lg:hidden text-center mb-10">
                        <img src="/logo.jpg" alt="Logo" className="w-20 h-20 rounded-2xl mx-auto mb-4 shadow-md" />
                        <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
                    </div>

                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                            <p className="text-sm text-gray-500 mt-2">Access your dashboard and courses</p>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                className="w-full flex justify-center items-center gap-3 bg-white text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 py-4 rounded-xl font-semibold transition-all duration-200 shadow-sm"
                            >
                                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Sign in with Google</span>
                            </Button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500">
                                Protected by <span className="font-semibold text-gray-700">Enterprise Security</span>
                            </p>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        <Link href="/" className="font-medium text-blue-600 hover:text-blue-500 hover:underline flex items-center justify-center gap-1 transition-colors">
                            &larr; Back to Home
                        </Link>
                    </p>

                    <div className="mt-6 text-center text-xs text-gray-400">
                        By signing in, you agree to our Terms and Privacy Policy.
                    </div>
                </div>
            </div>
        </div>
    );
}
