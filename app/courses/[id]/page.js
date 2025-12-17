"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, Lock, PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseDetails() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openMilestone, setOpenMilestone] = useState(0); // Index of open accordion
    const [activeVideo, setActiveVideo] = useState(null); // Currently playing video {videoId, title}

    useEffect(() => {
        if (params.id) {
            fetch(`/api/courses/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        console.error("API Error:", data.error);
                        setCourse(null);
                    } else {
                        setCourse(data);
                        // Default to first video of first milestone if available
                        if (data.milestones?.[0]?.videos?.[0]) {
                            setActiveVideo(data.milestones[0].videos[0]);
                        }
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="animate-spin" /></div>;
    if (!course) return <div className="min-h-screen grid place-items-center">Course not found</div>;

    // Access is now determined by the API
    const hasAccess = course?.hasAccess || false;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/courses" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area (Video Player) */}
                    <div className="lg:col-span-2 space-y-6">
                        {hasAccess && activeVideo ? (
                            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative group">
                                <iframe
                                    src={`https://www.youtube.com/embed/${activeVideo.videoId}?rel=0&modestbranding=1`}
                                    className="w-full h-full"
                                    title={activeVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="bg-gray-900 rounded-2xl aspect-video flex flex-col items-center justify-center text-white p-8 text-center">
                                <Lock size={48} className="mb-4 text-gray-500" />
                                <h3 className="text-xl font-bold mb-2">Content Locked</h3>
                                <p className="text-gray-400 max-w-md">
                                    {hasAccess ? "Select a video to start learning." : "Enroll in this course to access the full curriculum and recovery strategies."}
                                </p>
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{activeVideo?.title || course.title}</h1>
                            <p className="text-gray-600">{course.description}</p>
                        </div>
                    </div>

                    {/* Sidebar (Curriculum) */}
                    <div className="space-y-6">
                        <Card className="p-0 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-gray-100 bg-white">
                                <h2 className="text-lg font-bold text-gray-900">Course Curriculum</h2>
                                <p className="text-sm text-gray-500 mt-1">{course.milestones?.length || 0} Modules • {course.milestones?.reduce((acc, m) => acc + (m.videos?.length || 0), 0)} Resources</p>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {course.milestones?.map((milestone, index) => (
                                    <div key={milestone.id} className="bg-white">
                                        <button
                                            onClick={() => setOpenMilestone(openMilestone === index ? -1 : index)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left group"
                                        >
                                            <span className={`font-semibold text-sm transition-colors ${openMilestone === index ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}>
                                                {milestone.title}
                                            </span>
                                            {openMilestone === index ?
                                                <ChevronUp size={16} className="text-gray-400" /> :
                                                <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
                                            }
                                        </button>

                                        <AnimatePresence>
                                            {openMilestone === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-white"
                                                >
                                                    <div className="pb-3 px-2 space-y-0.5">
                                                        {milestone.videos?.map((video) => (
                                                            <button
                                                                key={video.id}
                                                                onClick={() => hasAccess && setActiveVideo(video)}
                                                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all relative overflow-hidden group/video
                                                                    ${activeVideo?.id === video.id
                                                                        ? "bg-blue-50 text-blue-700 border border-blue-100" // Soft Blue Active State
                                                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                                                    } 
                                                                    ${!hasAccess ? "opacity-90 cursor-not-allowed" : ""}
                                                                `}
                                                            >
                                                                {hasAccess ? (
                                                                    <PlayCircle
                                                                        size={16}
                                                                        className={`flex-shrink-0 transition-colors ${activeVideo?.id === video.id ? "text-blue-600" : "text-gray-400 group-hover/video:text-gray-900"}`}
                                                                    />
                                                                ) : (
                                                                    <Lock size={16} className="flex-shrink-0 text-gray-400" />
                                                                )}
                                                                <span className="text-sm truncate font-medium">{video.title}</span>

                                                                {/* Active Indicator Strip */}
                                                                {activeVideo?.id === video.id && (
                                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                                                                )}
                                                            </button>
                                                        ))}
                                                        {milestone.videos?.length === 0 && (
                                                            <p className="text-xs text-gray-400 text-center py-2 italic">No resources added</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {!hasAccess && (
                                <div className="p-6 bg-white border-t border-gray-100 mt-auto">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-1">Total Price</p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {course.price.startsWith("₹") ? course.price : "₹" + course.price}
                                            </p>
                                        </div>
                                        <Link href={`/payments?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price.startsWith("₹") ? course.price : "₹" + course.price)}`}>
                                            <Button className="w-full bg-black hover:bg-gray-800 text-white border-none py-3.5 text-base shadow-lg hover:shadow-xl transition-all">
                                                Enroll Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
