"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Clock, CheckCircle2, XCircle, BookOpen, CreditCard, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";

export default function DashboardPage() {
    const { data: session, status } = useSession({ required: true });
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (session) {
            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
            // console.log("Debug Admin Check:", ...); // logic replaced by visible warning below
            if (session.user?.email === adminEmail) {
                router.replace("/admin");
            } else if (session.user?.email === "hadowsir74@gmail.com") {
                // Specific help for this user
                alert(`Admin Access Config Error:\n\nLogged in as: ${session.user.email}\nConfigured Admin: ${adminEmail || "NOT SET"}\n\nPlease check your .env file and set NEXT_PUBLIC_ADMIN_EMAIL=${session.user.email}`);
            } else {
                fetchPaymentHistory();
            }
        }

    }, [session]);

    const fetchPaymentHistory = async () => {
        try {
            const res = await fetch("/api/payments");
            if (res.ok) {
                const data = await res.json();
                setPayments(data);
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    // Derived State
    const approvedPayments = payments.filter(p => p.status === "approved");
    const pendingPayments = payments.filter(p => p.status === "pending");
    const hasActiveCourses = approvedPayments.length > 0;

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <AnimatedSection>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                            <p className="text-gray-600 mt-1">Welcome back, <span className="font-semibold text-gray-900">{session.user?.name}</span></p>
                        </div>
                        <div className="flex gap-3">
                            {/* Actions removed */}
                        </div>
                    </div>
                </AnimatedSection>

                {/* Stats Grid */}
                <AnimatedSection delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 border-l-4 border-blue-500 bg-white shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Active Courses</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{approvedPayments.length}</p>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <BookOpen size={24} />
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-l-4 border-yellow-500 bg-white shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{pendingPayments.length}</p>
                                </div>
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                                    <Clock size={24} />
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-l-4 border-gray-400 bg-white shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{payments.length}</p>
                                </div>
                                <div className="p-3 bg-gray-100 text-gray-600 rounded-xl">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                        </Card>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Col: My Courses */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatedSection delay={0.2}>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">My Courses</h2>
                            {approvedPayments.length > 0 ? (
                                <div className="grid gap-6">
                                    {approvedPayments.map((payment) => (
                                        <TiltCard key={payment.id} className="h-full">
                                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-8">
                                                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                            Active
                                                        </span>
                                                        <BookOpen className="text-white/80" />
                                                    </div>

                                                    <h3 className="text-2xl font-bold mb-2 truncate pr-4" title={payment.course.split("|")[0].trim()}>{payment.course.split("|")[0].trim()}</h3>
                                                    <p className="text-blue-100 text-sm mb-6">ID: {payment.transactionId}</p>

                                                    <Link href="/courses">
                                                        <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none w-full sm:w-auto font-bold shadow-lg">
                                                            Access Content <ChevronRight size={16} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </TiltCard>
                                    ))}
                                </div>
                            ) : (
                                <Card className="py-12 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                        <BookOpen size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No Active Courses</h3>
                                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Once your payment is approved, your courses will appear here ready for you to access.</p>
                                    <Link href="/courses">
                                        <Button variant="outline">Browse Catalog</Button>
                                    </Link>
                                </Card>
                            )}
                        </AnimatedSection>
                    </div>

                    {/* Side Col: Recent Activity */}
                    <div className="space-y-6">
                        <AnimatedSection delay={0.3}>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                            <Card className="p-0 overflow-hidden bg-white shadow-sm border border-gray-100">
                                <div className="divide-y divide-gray-100">
                                    {payments.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500 text-sm">No recent activity</div>
                                    ) : (
                                        payments.slice(0, 5).map((payment) => (
                                            <div key={payment.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                                <div className={`p-2 rounded-full flex-shrink-0 ${payment.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                    payment.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                        'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    {payment.status === 'approved' ? <CheckCircle2 size={16} /> :
                                                        payment.status === 'rejected' ? <XCircle size={16} /> :
                                                            <Clock size={16} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {payment.course.split("|")[0].trim()}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(payment.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${payment.status === 'approved' ? 'bg-green-50 text-green-700' :
                                                    payment.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                                        'bg-yellow-50 text-yellow-700'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {payments.length > 5 && (
                                    <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                                        <button className="text-xs font-medium text-gray-600 hover:text-black">View All History</button>
                                    </div>
                                )}
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </div>
    );
}
