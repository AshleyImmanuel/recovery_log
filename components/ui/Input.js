import { twMerge } from "tailwind-merge";

export default function Input({ className, ...props }) {
    return (
        <input
            className={twMerge(
                "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black",
                className
            )}
            {...props}
        />
    );
}
