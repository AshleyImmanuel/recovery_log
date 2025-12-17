"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function TiltCard({ children, className = "" }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-200, 200], [5, -5]); // Reduced tilt range from 10 to 5
    const rotateY = useTransform(mouseX, [-200, 200], [-5, 5]);

    return (
        <motion.div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative transform-gpu card-3d-container will-change-transform ${className}`}
        >
            {/* Shadow/Glow layer behind */}
            <div style={{ transform: "translateZ(-20px)" }} className="absolute inset-4 bg-blue-500/20 rounded-3xl blur-2xl transition-opacity opacity-0 group-hover:opacity-100 duration-500" />

            {/* Main Card Content */}
            <div style={{ transform: "translateZ(20px)" }} className="relative h-full">
                {children}
            </div>
        </motion.div>
    );
}
