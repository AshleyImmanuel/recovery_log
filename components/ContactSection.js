"use client";

import { Instagram, MessageCircle, ArrowRight, Mail } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import Button from "./ui/Button";
import Link from "next/link";
import TiltCard from "./ui/TiltCard";

export default function ContactSection() {
    const whatsappMessage = encodeURIComponent("Hello, I would like to enquire about Recovery Log services.");
    const whatsappLink = `https://wa.me/919037602265?text=${whatsappMessage}`;
    const instagramLink = "https://www.instagram.com/recovery_log_?igsh=bWJ2M3BkcWZ0OHN6";

    return (
        <section className="py-12 md:py-24 bg-white relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <AnimatedSection>
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Get in Touch
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Have questions about our courses or services? Chat directly with our team.
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {/* WhatsApp Card */}
                    <AnimatedSection delay={0.1}>
                        <Link href={whatsappLink} target="_blank">
                            <TiltCard className="h-full">
                                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white h-full transition-all hover:shadow-xl hover:shadow-green-500/20">
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:scale-150" />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="mb-6 rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold">WhatsApp Support</h3>
                                        <p className="mt-2 text-green-50 font-medium">+91 90376 02265</p>
                                        <p className="mt-4 text-sm text-green-100 opacity-90">
                                            Instant answers to your queries.
                                        </p>
                                        <div className="mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-bold text-green-600 transition-transform group-hover:scale-105">
                                            Chat Now <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </Link>
                    </AnimatedSection>

                    {/* Instagram Card */}
                    <AnimatedSection delay={0.2}>
                        <Link href={instagramLink} target="_blank">
                            <TiltCard className="h-full">
                                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 text-white h-full transition-all hover:shadow-xl hover:shadow-pink-500/20">
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:scale-150" />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="mb-6 rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
                                            <Instagram size={40} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Official Instagram</h3>
                                        <p className="mt-2 text-pink-50 font-medium">@recovery_log_</p>
                                        <p className="mt-4 text-sm text-pink-100 opacity-90">
                                            Follow us for tips and updates.
                                        </p>
                                        <div className="mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-bold text-pink-600 transition-transform group-hover:scale-105">
                                            Follow Us <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </Link>
                    </AnimatedSection>

                    {/* Email Card (New) */}
                    <AnimatedSection delay={0.3}>
                        <Link href="mailto:hadowsir74@gmail.com">
                            <TiltCard className="h-full">
                                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 text-white h-full transition-all hover:shadow-xl hover:shadow-blue-500/20">
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:scale-150" />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="mb-6 rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
                                            <Mail size={40} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Email Support</h3>
                                        <p className="mt-2 text-blue-50 font-medium">hadowsir74@gmail.com</p>
                                        <p className="mt-4 text-sm text-blue-100 opacity-90">
                                            For official inquiries and support.
                                        </p>
                                        <div className="mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-bold text-blue-600 transition-transform group-hover:scale-105">
                                            Send Email <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </Link>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
}
