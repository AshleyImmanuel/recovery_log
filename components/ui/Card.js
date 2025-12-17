import { twMerge } from "tailwind-merge";

export default function Card({ children, className }) {
    return (
        <div
            className={twMerge(
                "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300",
                className
            )}
        >
            {children}
        </div>
    );
}
