"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2200); // Slightly longer to let the text read, then swift exit

        return () => clearTimeout(timer);
    }, []);

    // 5 Columns for the shutter effect
    const columns = [0, 1, 2, 3, 4];

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">

                    {/* Background Shutters */}
                    <div className="absolute inset-0 flex h-full w-full">
                        {columns.map((index) => (
                            <motion.div
                                key={index}
                                className="relative h-full flex-1 bg-black border-r border-neutral-900 last:border-r-0"
                                initial={{ y: 0 }}
                                exit={{
                                    y: "-100%",
                                    transition: {
                                        duration: 0.8,
                                        ease: [0.76, 0, 0.24, 1], // Custombezier for premium feel
                                        delay: index * 0.1, // Stagger effect
                                    },
                                }}
                            />
                        ))}
                    </div>

                    {/* Logo & Content */}
                    <motion.div
                        className="absolute z-20 flex flex-col items-center justify-center overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
                        }}
                        exit={{
                            opacity: 0,
                            y: -50,
                            transition: { duration: 0.5, ease: "easeInOut" }
                        }}
                    >
                        <div className="flex items-center gap-4 mb-2">
                            {/* Abstract Geometric Logo Idea */}
                            <motion.div
                                className="w-12 h-12 border-4 border-white flex items-center justify-center"
                                animate={{ rotate: 90 }}
                                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                            >
                                <div className="w-4 h-4 bg-white" />
                            </motion.div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                                RECOVERY<span className="text-neutral-500">LOG</span>
                            </h1>
                        </div>
                        <motion.div
                            className="h-1 bg-white mt-4"
                            initial={{ width: 0 }}
                            animate={{ width: 100 }}
                            transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
