"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Loader2, User, LogOut, Mail, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, status } = useSession({ required: true });
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        if (session) {
            const fetchPaymentHistory = async () => {
                try {
                    const res = await fetch("/api/payments");
                    if (res.ok) {
                        const data = await res.json();
                        setPayments(data.filter(p => p.status === "approved"));
                    }
                } catch (error) {
                    console.error("Failed to fetch payments", error);
                }
            };
            fetchPaymentHistory();
        }
    }, [session]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <AnimatedSection>

                    {session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
                        <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 block transition-colors">
                            &larr; Back to Admin Panel
                        </Link>
                    ) : (
                        <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 block transition-colors">
                            &larr; Back to Dashboard
                        </Link>
                    )}

                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

                    <Card className="p-0 overflow-hidden bg-white shadow-xl shadow-gray-200/50 border border-gray-100 rounded-2xl">
                        {/* Banner - Solid energetic blue to match brand */}
                        <div className="h-32 bg-blue-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-cyan-500 opacity-90" />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                        </div>

                        <div className="px-8 pb-8 relative">
                            {/* Avatar */}
                            <div className="absolute -top-16 left-8">
                                <motion.div
                                    className="p-1.5 bg-white rounded-full shadow-lg"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="Profile"
                                            referrerPolicy="no-referrer"
                                            className="w-32 h-32 rounded-full border-4 border-white shadow-sm bg-white object-cover"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-sm bg-gray-50 flex items-center justify-center text-gray-400">
                                            <User size={64} />
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end pt-4 mb-4">
                                <Button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 hover:text-red-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium"
                                >
                                    <LogOut size={16} /> Sign Out
                                </Button>
                            </div>

                            {/* Info */}
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold text-gray-900">{session.user?.name}</h2>
                                <p className="text-gray-500 font-medium">
                                    {session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? "Administrator" : "Client"}
                                </p>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 text-gray-700 mb-1">
                                            <Mail size={18} className="text-blue-500" />
                                            <span className="font-medium text-sm">Email Address</span>
                                        </div>
                                        <p className="text-gray-900 pl-8 font-medium truncate">{session.user?.email}</p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 text-gray-700 mb-1">
                                            <Calendar size={18} className="text-blue-500" />
                                            <span className="font-medium text-sm">Member Status</span>
                                        </div>
                                        <p className="text-gray-900 pl-8 font-medium">Active</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Account Management</h3>
                                    <p className="text-sm text-gray-500 mb-6 max-w-lg">
                                        For security reasons, changing your name or email details linked to Google must be done through your Google Account settings.
                                    </p>
                                    <Link href="https://myaccount.google.com/" target="_blank">
                                        <Button className="bg-gray-900 text-white hover:bg-black">
                                            Manage Google Account
                                        </Button>
                                    </Link>
                                </div>

                                {/* Purchased Courses Section */}
                                {payments.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">My Access</h3>
                                        <div className="grid gap-4">
                                            {payments.map((payment) => (
                                                <div key={payment.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between group hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                                            <BookOpen size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{payment.course.split("|")[0].trim()}</p>
                                                            <p className="text-xs text-gray-500">Active License</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => window.location.href = `/courses/${payment.courseId}`}
                                                        className="px-4 py-2 text-xs bg-white text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white shadow-none hover:shadow-lg"
                                                    >
                                                        Access
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </AnimatedSection>
            </div>
        </div>
    );
}
