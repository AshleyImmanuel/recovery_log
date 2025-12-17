"use client";

import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export default function Button({ children, className, onClick, type = "button", ...props }) {
    return (
        <motion.button
            whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.15)"
            }}
            whileTap={{ scale: 0.95, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            type={type}
            onClick={onClick}
            className={twMerge(
                "px-6 py-3 rounded-xl font-semibold transition-all duration-200",
                "bg-black text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
