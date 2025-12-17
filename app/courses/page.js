"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, BookOpen, Video, Users, Filter } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Card from "@/components/ui/Card";
import TiltCard from "@/components/ui/TiltCard";
import Button from "@/components/ui/Button";
import TechLoader from "@/components/TechLoader";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [ownedCourseTitles, setOwnedCourseTitles] = useState(new Set());
    const [ownedCourseIds, setOwnedCourseIds] = useState(new Set()); // Fallback if IDs used later

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch public courses
                const resCourses = await fetch("/api/courses");
                if (resCourses.ok) {
                    const data = await resCourses.json();

                    // Deduplicate
                    const uniqueData = data.filter((course, index, self) =>
                        index === self.findIndex((c) => c.title.trim() === course.title.trim())
                    );
                    setCourses(uniqueData);
                }

                // Fetch user payments (only works if logged in, otherwise fails silently)
                const resPayments = await fetch("/api/payments");
                if (resPayments.ok) {
                    const myPayments = await resPayments.json();
                    const approved = myPayments.filter(p => p.status === 'approved');

                    // Normalize to lowercase for case-insensitive matching
                    const titles = new Set(approved.map(p => p.course.split("|")[0].trim().toLowerCase()));
                    setOwnedCourseTitles(titles);
                }

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortedCourses = [...courses].sort((a, b) => {
        const aTitle = a.title.trim().toLowerCase();
        const bTitle = b.title.trim().toLowerCase();
        const aOwned = ownedCourseIds.has(a.id) || ownedCourseTitles.has(aTitle);
        const bOwned = ownedCourseIds.has(b.id) || ownedCourseTitles.has(bTitle);

        if (sortBy === "purchased") {
            // Purchased first
            if (aOwned && !bOwned) return -1;
            if (!aOwned && bOwned) return 1;
            // Then by date
            return new Date(b.createdAt) - new Date(a.createdAt);
        }

        // For other sorts, we can optionally keep purchased on top if desired, 
        // but user specifically asked for a filter/sort option. 
        // However, "make sure purchased course comes on top" might imply general visibility.
        // Let's stick to the specific sort option for now to avoid disrupting "Newest".

        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "bestselling") return (b.sales || 0) - (a.sales || 0);
        return 0;
    });

    const filteredCourses = sortedCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const maxSales = Math.max(...courses.map(c => c.sales || 0));

    return (
        <main className="pt-24 pb-24 min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <AnimatedSection>
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Available Courses</h1>
                        <p className="mt-2 text-lg text-gray-600">Master digital recovery and growth with our expert-led programs.</p>
                    </div>
                </AnimatedSection>

                {/* Search and Sort Toolbar */}
                <div className="max-w-2xl mx-auto mb-12 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-10 py-4 rounded-2xl border-0 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] focus:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.15)] ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 text-gray-700 placeholder:text-gray-400"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 p-1 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        )}
                    </div>

                    <div className="relative min-w-[180px]">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between pl-4 pr-4 py-4 rounded-2xl border-0 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.15)] ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 text-gray-700 group"
                        >
                            <span className="flex items-center gap-2">
                                <Filter size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                <span className="font-medium">
                                    {sortBy === 'newest' && 'Newest'}
                                    {sortBy === 'oldest' && 'Oldest'}
                                    {sortBy === 'bestselling' && 'Best Selling'}
                                    {sortBy === 'purchased' && 'Purchased'}
                                </span>
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    {[
                                        { value: 'newest', label: 'Newest First' },
                                        { value: 'oldest', label: 'Oldest First' },
                                        { value: 'bestselling', label: 'Best Selling' },
                                        { value: 'purchased', label: 'Purchased' }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSortBy(option.value);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 flex items-center justify-between group
                                                ${sortBy === option.value ? 'bg-blue-50/50 text-blue-600 font-medium' : 'text-gray-600'}
                                            `}
                                        >
                                            {option.label}
                                            {sortBy === option.value && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><polyline points="20 6 9 17 4 12" /></svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {loading ? (
                    <TechLoader fullScreen={false} />
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {filteredCourses.map((course, index) => (
                            <AnimatedSection key={course.id} delay={index * 0.1}>
                                <div className="block h-full perspective-1000">
                                    <TiltCard className="h-full">
                                        <Card className="h-full flex flex-col hover:border-blue-500 hover:ring-1 hover:ring-blue-500 cursor-pointer group transition-all duration-300 bg-white relative overflow-hidden">

                                            {/* Badge Container */}
                                            <div className="absolute top-0 right-0 z-10 flex flex-col items-end gap-1">
                                                {/* Best Selling Badge */}
                                                {course.sales > 0 && course.sales === maxSales && (
                                                    <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1 animate-pulse">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M2 9a3 3 0 0 1 0-6c.772 0 1.488.31 2 .813A2.99 2.99 0 0 1 6 3a3 3 0 0 1 2 .813C8.512 3.31 9.228 3 10 3a3 3 0 0 1 2.934 2.275A2.993 2.993 0 0 1 14 5a3 3 0 0 1 2-.813A2.99 2.99 0 0 1 18 3a3 3 0 0 1 2.934 2.275A2.993 2.993 0 0 1 22 9v12H2V9zM4 11v8h16v-8l-8-4-8 4z" /></svg>
                                                        Best Seller
                                                    </div>
                                                )}

                                                {/* Students Count Badge */}
                                                {course.sales > 0 && (
                                                    <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1">
                                                        <Users size={12} /> {course.sales} Students
                                                    </div>
                                                )}
                                            </div>

                                            {/* Course Details Link (Clicking card body) */}
                                            <Link href={`/courses/${course.id}`} className="flex-1 flex flex-col">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mt-2">{course.title}</h3>
                                                <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                                                    {course.price.startsWith("₹") ? course.price : "₹" + course.price}
                                                </p>
                                                <p className="mt-4 text-gray-600 flex-1">{course.description}</p>
                                                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <BookOpen size={16} className="text-blue-500" />
                                                        <span>{course.milestones?.length || 0} Modules</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Video size={16} className="text-purple-500" />
                                                        <span>{course.milestones?.reduce((acc, m) => acc + (m.videos?.length || 0), 0) || 0} Videos</span>
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Enroll Button Trigger (Direct to Payment) */}
                                            {/* Action Button: Enroll vs Access */}
                                            {ownedCourseIds.has(course.id) || ownedCourseTitles.has(course.title.trim().toLowerCase()) ? (
                                                <Link href={`/courses/${course.id}`} className="w-full">
                                                    <Button className="mt-8 w-full bg-green-600 text-white hover:bg-green-700 border-none shadow-lg flex items-center justify-center gap-2">
                                                        <BookOpen size={18} /> Access Course
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Link href={`/payments?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price.startsWith("₹") ? course.price : "₹" + course.price)}`} className="w-full">
                                                    <Button className="mt-8 w-full bg-gray-100 text-gray-900 hover:bg-black hover:text-white group-hover:bg-gradient-aurora group-hover:text-white border-none shadow-lg">
                                                        Enroll Now
                                                    </Button>
                                                </Link>
                                            )}
                                        </Card>
                                    </TiltCard>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                            <ShieldCheck size={48} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No courses available right now</h3>
                        <p className="text-gray-500 mt-2">Please check back later for new programs.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
