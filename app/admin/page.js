"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle2, XCircle, Search, Trash2, Edit2, X, BookOpen, CreditCard, TrendingUp, Activity, Library, Users, Loader2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import Toast from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

export default function AdminPage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  // Toast State
  const [toast, setToast] = useState(null);

  // Tabs: 'payments' | 'courses'
  const [activeTab, setActiveTab] = useState("payments");

  // Payments State
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Courses State
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null); // null = list, 'new' = creating, object = editing
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: "", price: "", description: "", milestones: [] });

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.email !== ADMIN_EMAIL) {
        router.push("/dashboard");
      } else {
        fetchData();
      }
    }
  }, [status, session, ADMIN_EMAIL]);

  useEffect(() => {
    // Filter Payments
    let result = payments;
    if (filterStatus !== "all") {
      result = result.filter(p => p.status === filterStatus);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.course.toLowerCase().includes(term) ||
        p.transactionId.toLowerCase().includes(term) ||
        p.userEmail.toLowerCase().includes(term)
      );
    }
    setFilteredPayments(result);
  }, [payments, filterStatus, searchTerm]);

  const fetchData = async () => {
    setPaymentsLoading(true);
    setCoursesLoading(true);
    try {
      const [paymentsRes, coursesRes] = await Promise.all([
        fetch("/api/admin/payments"),
        fetch("/api/courses") // Public endpoint is fine for reading
      ]);

      if (paymentsRes.ok) {
        const pData = await paymentsRes.json();
        setPayments(pData);
        setFilteredPayments(pData);
      }
      if (coursesRes.ok) {
        const cData = await coursesRes.json();
        // Deduplicate by title (keep the first one or most recent)
        const uniqueCourses = Object.values(
          cData.reduce((acc, course) => {
            if (!acc[course.title]) acc[course.title] = course;
            return acc;
          }, {})
        );
        setCourses(uniqueCourses);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPaymentsLoading(false);
      setCoursesLoading(false);
    }
  };

  const handlePaymentStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        setToast({ message: `Payment marked as ${newStatus}`, type: "success" });
      }
    } catch (error) {
      console.error("Update failed", error);
      setToast({ message: "Failed to update payment", type: "error" });
    }
  };

  // Helper to extract Video ID
  const extractVideoId = (url) => {
    if (!url) return '';
    // Handle standard URL, short URL, and iframe src
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url; // Return ID or original if not found
  };

  const handleAddMilestone = () => {
    setCourseForm(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), { title: "", videos: [] }]
    }));
  };

  const removeMilestone = (index) => {
    const newMilestones = [...courseForm.milestones];
    newMilestones.splice(index, 1);
    setCourseForm(prev => ({ ...prev, milestones: newMilestones }));
  };

  const updateMilestone = (index, field, value) => {
    const newMilestones = [...courseForm.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setCourseForm(prev => ({ ...prev, milestones: newMilestones }));
  };

  const addVideo = (mIndex) => {
    const newMilestones = [...courseForm.milestones];
    newMilestones[mIndex].videos.push({ title: "", url: "" });
    setCourseForm(prev => ({ ...prev, milestones: newMilestones }));
  };

  const removeVideo = (mIndex, vIndex) => {
    const newMilestones = [...courseForm.milestones];
    newMilestones[mIndex].videos.splice(vIndex, 1);
    setCourseForm(prev => ({ ...prev, milestones: newMilestones }));
  };

  const updateVideo = (mIndex, vIndex, field, value) => {
    const newMilestones = [...courseForm.milestones];
    const video = { ...newMilestones[mIndex].videos[vIndex] };
    video[field] = value;
    // Isolate ID if it's the URL field
    if (field === 'url') {
      video.videoId = extractVideoId(value);
    }
    newMilestones[mIndex].videos[vIndex] = video;
    setCourseForm(prev => ({ ...prev, milestones: newMilestones }));
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      const res = await fetch(`/api/admin/courses?id=${courseToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(prev => prev.filter(c => c.id !== courseToDelete));
        setToast({ message: "Course deleted", type: "success" });
      }
      setCourseToDelete(null); // Close modal
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to delete course", type: "error" });
    }
  }

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Check for duplicates
      const isDuplicate = courses.some(c =>
        c.title.trim().toLowerCase() === courseForm.title.trim().toLowerCase() &&
        c.id !== editingCourse?.id
      );

      if (isDuplicate) {
        setToast({ message: "A course with this name already exists.", type: "error" });
        setIsSubmitting(false);
        return;
      }

      // Deep clone to avoid mutating state directly during submit prep
      const payload = JSON.parse(JSON.stringify(courseForm));

      // Ensure all videos have IDs and titles
      if (payload.milestones && Array.isArray(payload.milestones)) {
        for (const m of payload.milestones) {
          if (m.videos && Array.isArray(m.videos)) {
            for (const v of m.videos) {
              if (!v.title || !v.title.trim()) {
                setToast({ message: "Validation Error: All videos must have a Title.", type: "error" });
                setIsSubmitting(false);
                return;
              }
              if (!v.url && !v.videoId) {
                setToast({ message: `Validation Error: Video "${v.title}" is missing a YouTube URL.`, type: "error" });
                setIsSubmitting(false);
                return;
              }

              // Strict URL Validation
              const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
              if (v.url && !youtubeRegex.test(v.url)) {
                setToast({ message: `Invalid URL: "${v.url}" is not a valid YouTube link.`, type: "error" });
                setIsSubmitting(false);
                return;
              }

              if (!v.videoId && v.url) v.videoId = extractVideoId(v.url);
            }
          }
        }
      }

      const method = editingCourse === 'new' ? "POST" : "PUT";
      if (editingCourse !== 'new') payload.id = editingCourse.id;

      const res = await fetch("/api/admin/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Refresh courses
        const coursesRes = await fetch("/api/courses");
        const cData = await coursesRes.json();

        // Deduplicate
        const uniqueCourses = Object.values(
          cData.reduce((acc, course) => {
            if (!acc[course.title]) acc[course.title] = course;
            return acc;
          }, {})
        );
        setCourses(uniqueCourses);

        setEditingCourse(null);
        setCourseForm({ title: "", price: "", description: "", milestones: [] });
        setToast({ message: "Course saved successfully!", type: "success" });
      } else {
        setToast({ message: "Failed to save course", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "Error saving course", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(prev => prev.filter(c => c.id !== id));
        setToast({ message: "Course deleted", type: "success" });
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to delete course", type: "error" });
    }
  }

  const startEdit = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      price: course.price,
      description: course.description,
      milestones: course.milestones || [] // Assuming API returns milestones now
    });
  }

  if (status === "loading") return <div className="min-h-screen grid place-items-center"><Loader2 className="animate-spin" /></div>;
  if (session?.user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <Modal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        title="Delete Course"
        footer={
          <>
            <Button onClick={() => setCourseToDelete(null)} className="bg-gray-100 text-gray-900 border border-gray-200">Cancel</Button>
            <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">Delete Permanently</Button>
          </>
        }
      >
        <p className="text-gray-600">Are you sure you want to delete this course? This action cannot be undone and will remove all associated content.</p>
      </Modal>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header - Premium SaaS Style */}
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Control Center</h1>
              <p className="text-lg text-gray-500 mt-2">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Modern Tab Switcher */}
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
              <button
                onClick={() => setActiveTab("payments")}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === "payments" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                <CreditCard size={18} /> Payment Requests
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === "courses" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                <BookOpen size={18} /> Manage Courses
              </button>
            </div>
          </div>

          {/* Analytics Dashboard - Floating Cards with Glows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Revenue */}
            <Card className="p-6 border-0 shadow-lg shadow-gray-200/50 bg-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="p-3 bg-green-100 rounded-xl w-fit mb-4 text-green-600">
                  <TrendingUp size={24} />
                </div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Est. Revenue</p>
                <p className="text-3xl font-black text-gray-900 mt-1">
                  ₹{payments
                    .filter(p => p.status === 'approved')
                    .reduce((acc, p) => {
                      // Extract title from "Course Name | WA: ..." format
                      const courseTitle = p.course.split("|")[0].trim();
                      const course = courses.find(c => c.title.trim() === courseTitle);
                      const price = course ? Number(course.price.replace(/[^0-9.-]+/g, "")) : 0;
                      return acc + (isNaN(price) ? 0 : price);
                    }, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                  <span className="text-green-600 font-bold">+{payments.filter(p => p.status === 'approved').length}</span> approved orders.
                </p>
              </div>
            </Card>

            {/* Pending Requests */}
            <Card className="p-6 border-0 shadow-lg shadow-gray-200/50 bg-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4 text-blue-600">
                  <Activity size={24} />
                </div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Pending Requests</p>
                <p className="text-3xl font-black text-blue-600 mt-1">
                  {payments.filter(p => p.status === 'pending').length}
                </p>
                <div className="flex gap-3 mt-2 text-sm font-medium">
                  <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{payments.filter(p => p.status === 'approved').length} Approved</span>
                  <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md">{payments.filter(p => p.status === 'rejected').length} Rejected</span>
                </div>
              </div>
            </Card>

            {/* Content Library */}
            <Card className="p-6 border-0 shadow-lg shadow-gray-200/50 bg-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4 text-purple-600">
                  <Library size={24} />
                </div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Content Library</p>
                <p className="text-3xl font-black text-gray-900 mt-1">
                  {courses.length}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {courses.reduce((acc, c) => acc + (c.milestones?.length || 0), 0)} Modules • {courses.reduce((acc, c) => acc + (c.milestones?.reduce((v, m) => v + (m.videos?.filter(vid => vid.url || vid.videoId).length || 0), 0) || 0), 0)} Videos
                </p>
              </div>
            </Card>

            {/* Active Users */}
            <Card className="p-6 border-0 shadow-lg shadow-gray-200/50 bg-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="p-3 bg-orange-100 rounded-xl w-fit mb-4 text-orange-600">
                  <Users size={24} />
                </div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Unique Clients</p>
                <p className="text-3xl font-black text-gray-900 mt-1">
                  {new Set(payments.map(p => p.userEmail)).size}
                </p>
                <p className="text-sm text-gray-400 mt-2">Total transactions: {payments.length}</p>
              </div>
            </Card>
          </div>
        </AnimatedSection>

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <>
            <AnimatedSection delay={0.1}>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    placeholder="Search by email, course, or ref ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {["all", "pending", "approved", "rejected"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${filterStatus === s
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="overflow-hidden">
                <div className="space-y-3">
                  {/* Header Row (Hidden on mobile, stylized on desktop) */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-3">Client</div>
                    <div className="col-span-3">Course Details</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {/* Floating Rows */}
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="group bg-white rounded-xl p-4 md:px-6 md:py-5 border border-gray-100 shadow-sm hover:shadow-md transition-all md:grid grid-cols-12 gap-4 items-center">
                      {/* Mobile Label */}
                      <div className="md:hidden text-xs text-gray-400 mb-1">Date</div>
                      <div className="col-span-2 text-sm font-medium text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>

                      <div className="md:hidden text-xs text-gray-400 mt-2 mb-1">Client</div>
                      <div className="col-span-3">
                        <div className="text-sm font-bold text-gray-900">{payment.userEmail}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-[150px]">{payment.transactionId}</div>
                      </div>

                      <div className="md:hidden text-xs text-gray-400 mt-2 mb-1">Course</div>
                      <div className="col-span-3">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                          {payment.course}
                        </div>
                      </div>

                      <div className="md:hidden text-xs text-gray-400 mt-2 mb-1">Status</div>
                      <div className="col-span-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${payment.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                          payment.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${payment.status === 'approved' ? 'bg-green-500' :
                            payment.status === 'rejected' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`} />
                          {payment.status}
                        </span>
                      </div>

                      <div className="col-span-2 flex justify-end gap-3 mt-4 md:mt-0">
                        {payment.status === "pending" && (
                          <>
                            <button
                              onClick={() => handlePaymentStatus(payment.id, "approved")}
                              className="p-2 rounded-lg text-green-600 hover:bg-green-50 hover:scale-110 transition-all"
                              title="Approve"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                            <button
                              onClick={() => handlePaymentStatus(payment.id, "rejected")}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:scale-110 transition-all"
                              title="Reject"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredPayments.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                      <div className="bg-gray-50 text-gray-400 p-4 rounded-full inline-block mb-4">
                        <Search size={32} />
                      </div>
                      <p className="text-gray-500 font-medium">No payments found matching your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </>
        )}

        {/* COURSES TAB */}
        {activeTab === "courses" && (
          <AnimatedSection delay={0.1}>
            {!editingCourse ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold">Your Courses</h2>
                  <Button onClick={() => { setEditingCourse('new'); setCourseForm({ title: "", price: "", description: "", milestones: [] }) }} className="flex items-center gap-2">
                    <Plus size={18} /> Add New Course
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <Card key={course.id} className="relative group">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(course)} className="p-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setCourseToDelete(course.id)} className="p-2 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                      <p className="text-2xl font-black text-blue-600 mb-4">
                        {course.price.toString().startsWith('₹') ? course.price : `₹${course.price}`}
                      </p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <BookOpen size={12} className="text-blue-500" />
                          {course.milestones?.length || 0} Modules • {course.milestones?.reduce((acc, m) => acc + (m.videos?.length || 0), 0) || 0} Videos
                        </div>
                      </div>
                    </Card>
                  ))}
                  {courses.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                      No courses added yet. Click "Add New Course" to get started.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Card className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{editingCourse === 'new' ? "Create New Course" : "Edit Course"}</h2>
                  <button onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
                </div>
                <form onSubmit={handleSaveCourse} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Basic Info</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                      <Input required value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="e.g. Instagram Mastery" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (Display Text)</label>
                      <Input required value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} placeholder="e.g. ₹4,999" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        rows={3}
                        required
                        value={courseForm.description}
                        onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                        placeholder="Brief summary of the course..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="text-lg font-semibold">Curriculum (Milestones & Videos)</h3>
                      <Button type="button" onClick={handleAddMilestone} className="text-xs bg-gray-100 text-gray-900 hover:bg-gray-200">
                        + Add Milestone
                      </Button>
                    </div>

                    {courseForm.milestones?.map((milestone, mIndex) => (
                      <div key={mIndex} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Milestone Title (e.g. Module 1)"
                              value={milestone.title || ""}
                              onChange={(e) => updateMilestone(mIndex, 'title', e.target.value)}
                              className="bg-white"
                            />
                          </div>
                          <button type="button" onClick={() => removeMilestone(mIndex)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Videos List */}
                        <div className="pl-4 border-l-2 border-gray-200 space-y-3">
                          {milestone.videos?.map((video, vIndex) => (
                            <div key={vIndex} className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Video Title"
                                  value={video.title || ""}
                                  onChange={(e) => updateVideo(mIndex, vIndex, 'title', e.target.value)}
                                  className="flex-1 text-sm h-9"
                                  required
                                />
                                <Input
                                  placeholder="YouTube URL (Unlisted)"
                                  value={video.url || video.videoId || ""}
                                  onChange={(e) => updateVideo(mIndex, vIndex, 'url', e.target.value)}
                                  className="flex-1 text-sm h-9"
                                  required
                                />                       <button type="button" onClick={() => removeVideo(mIndex, vIndex)} className="text-red-400 hover:text-red-600">
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <Button type="button" onClick={() => addVideo(mIndex)} className="w-full text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border-none py-2">
                            + Add Video to {milestone.title || 'Module'}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {courseForm.milestones?.length === 0 && <p className="text-sm text-gray-500 italic text-center">No milestones yet.</p>}
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <Button type="button" onClick={() => setEditingCourse(null)} disabled={isSubmitting} className="flex-1 bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50">Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} /> Saving...
                        </>
                      ) : (
                        "Save Course"
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </AnimatedSection>
        )}

      </div>
    </div>
  );
}
