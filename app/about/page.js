"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Card from "@/components/ui/Card";
import TiltCard from "@/components/ui/TiltCard";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { ShieldCheck, Users, Globe, BookOpen, TrendingUp, Lock } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="pt-24 pb-24 min-h-screen bg-gray-50 text-gray-900">

            {/* Hero / Mission Statement */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8 mb-24">
                <AnimatedSection>
                    <div className="text-center max-w-4xl mx-auto">
                        <span className="text-gradient font-bold tracking-wide uppercase text-sm">Our Mission</span>
                        <h1 className="mt-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Come to us to learn about Social Media.
                        </h1>
                        <p className="mt-6 text-xl leading-8 text-gray-600">
                            We don't just recover accounts; we teach you how to succeed online.
                            From understanding algorithms to building a loyal audience, we provide the blueprint for digital growth.
                        </p>
                    </div>
                </AnimatedSection>
            </section>

            {/* Core Values Grid */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnimatedSection delay={0.1}>
                        <TiltCard className="h-full">
                            <Card className="text-center h-full p-8 border-t-4 border-blue-500 bg-white/90">
                                <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                                    <BookOpen size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Complete Education</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We strip away the mystery. Learn how platforms actually work, how to leverage trends, and how to build a sustainable audience.
                                </p>
                            </Card>
                        </TiltCard>
                    </AnimatedSection>
                    <AnimatedSection delay={0.2}>
                        <TiltCard className="h-full">
                            <Card className="text-center h-full p-8 border-t-4 border-indigo-500 bg-white/90">
                                <div className="mx-auto h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Platform Guidelines</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Avoid bans and restrictions by understanding community guidelines and best practices for safe account management.
                                </p>
                            </Card>
                        </TiltCard>
                    </AnimatedSection>
                    <AnimatedSection delay={0.3}>
                        <TiltCard className="h-full">
                            <Card className="text-center h-full p-8 border-t-4 border-cyan-500 bg-white/90">
                                <div className="mx-auto h-16 w-16 bg-cyan-50 rounded-full flex items-center justify-center mb-6 text-cyan-600">
                                    <TrendingUp size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Strategic Growth</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Move beyond luck. Our data-driven strategies help you monetize your content and turn your passion into a profession.
                                </p>
                            </Card>
                        </TiltCard>
                    </AnimatedSection>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
                {/* Abstract gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-gray-900 pointer-events-none" />

                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
                    <AnimatedSection>
                        <h2 className="text-3xl font-bold sm:text-4xl mb-6">Ready to Master the Digital World?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                            Join thousands of students who have transformed their understanding of social media with Recovery Log.
                        </p>
                        <Link href="/courses">
                            <Button className="bg-gradient-aurora hover:opacity-90 transition-opacity text-white px-8 py-4 text-lg rounded-full border-none">
                                Start Learning Today
                            </Button>
                        </Link>
                    </AnimatedSection>
                </div>
            </section>
        </main>
    );
}
