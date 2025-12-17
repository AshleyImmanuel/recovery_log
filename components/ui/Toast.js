"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const variants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    const colors = {
        success: "bg-white border-green-100 text-green-800",
        error: "bg-white border-red-100 text-red-800",
        warning: "bg-white border-yellow-100 text-yellow-800"
    };

    const icons = {
        success: <CheckCircle2 className="text-green-500" size={20} />,
        error: <XCircle className="text-red-500" size={20} />,
        warning: <AlertCircle className="text-yellow-500" size={20} />
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
            <AnimatePresence>
                {message && (
                    <motion.div
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-2xl border ${colors[type]}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="shrink-0">{icons[type]}</div>
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                        <button onClick={onClose} className="shrink-0 text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
