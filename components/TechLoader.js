"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TechLoader({ fullScreen = true }) {
    // 3x3 Grid pattern = 9 blocks
    const blocks = Array.from({ length: 9 }, (_, i) => i);
    const [delays, setDelays] = useState([]);

    useEffect(() => {
        setDelays(blocks.map(() => Math.random() * 0.5));
    }, []);

    return (
        <div className={`${fullScreen ? "fixed inset-0 z-[100] bg-white" : "w-full py-24"} flex flex-col items-center justify-center gap-8`}>

            {/* 3x3 Data Grid Animation */}
            <div className="grid grid-cols-3 gap-1">
                {blocks.map((i, index) => (
                    <motion.div
                        key={i}
                        className="w-3 h-3 bg-blue-600 rounded-[1px]"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: delays[index] || 0, // Use state-based delay
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Minimal Brand Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
            >
                <h3 className="text-sm font-semibold tracking-[0.3em] text-gray-900 uppercase">
                    Recovery Log
                </h3>
            </motion.div>
        </div>
    );
}
