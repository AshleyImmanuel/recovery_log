"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Zap, TrendingUp, ArrowRight } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import Button from "@/components/ui/Button";

// Optimized Animation Variants (No infinite loops)
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] // Custom "easeOutQuint" for luxurious feel
    }
  },
};

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col min-h-[90vh]">

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-32 pb-20 md:pt-48 text-center flex-1 flex flex-col justify-center">
        {/* Static Background for Performance (No gradients) */}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={item} className="mb-8 flex justify-center">
            <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10">
              Trusted by 10,000+ Creators
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-6 leading-tight drop-shadow-sm"
          >
            Reclaim Your <br />
            <span className="text-gradient">
              Digital Presence
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-4 text-xl leading-relaxed text-gray-600 max-w-2xl mx-auto">
            The #1 platform for account recovery and monetization.
            Manual verification, expert protocol courses, and 24/7 support.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses">
              <Button className="flex items-center gap-2 text-lg px-8 py-4 w-full sm:w-auto justify-center bg-gradient-aurora text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all border-none">
                Browse Courses <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/about">
              <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 px-8 py-4 w-full sm:w-auto justify-center">
                Why Choose Us
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Education / Mission Preview */}
      <section className="py-16 md:py-24 border-y border-gray-100/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }} // Reduced movement for mobile smoothness
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }} // Triggers sooner
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[2rem] bg-black p-6 md:p-8 flex items-center justify-center relative overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.01]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <Zap size={60} className="relative text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] md:w-20 md:h-20" />
                  </div>

                  {/* Floating Social Icons */}
                  <div className="absolute -right-8 -top-2 md:-right-12 md:-top-4 animate-bounce hover:scale-110 transition-transform">
                    <div className="bg-white p-2 md:p-2.5 rounded-xl shadow-lg shadow-pink-500/20">
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-md" />
                    </div>
                  </div>

                  <div className="absolute -left-6 bottom-4 md:-left-10 md:bottom-2 md:animate-pulse">
                    <div className="bg-white p-2 md:p-2.5 rounded-xl shadow-lg shadow-green-500/20">
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4 md:mb-6">
                We teach you what <br />
                <span className="text-blue-600">Social Media</span> is all about.
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
                It's more than just posting photos. It's about consistency, algorithms, and community.
                Our comprehensive curriculum breaks down the barriers between you and digital success.
              </p>
              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {["Algorithm Mastery", "Content Monetization", "Platform Guidelines"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/about">
                <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200 w-full sm:w-auto justify-center">
                  Read Our Mission
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats / Features Strip */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="border-y border-gray-100/50 py-12 md:py-16"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[{ icon: Shield, bg: "bg-blue-50", text: "text-blue-600", title: "100% Verified", desc: "Manual checks for every transaction" },
            { icon: Zap, bg: "bg-cyan-50", text: "text-cyan-600", title: "Instant Access", desc: "Start learning immediately after approval" },
            { icon: TrendingUp, bg: "bg-indigo-50", text: "text-indigo-600", title: "Proven Results", desc: "Strategies tested on 50k+ accounts" }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`p-3 ${feature.bg} ${feature.text} rounded-xl mb-4`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}