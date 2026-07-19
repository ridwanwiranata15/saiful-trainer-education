import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Folder,
    FileX,
    Home,
    Calendar,
    CalendarDays,
    Clock,
    MapPin,
    BarChart3,
    Info,
    Rocket,
    Users,
    Briefcase,
    Newspaper,
    BarChart2,
    Bot,
    Phone,
    HelpCircle,
    Star,
    Flame,
    Gift,
    Loader2,
    Check, // <-- added Check icon
} from "lucide-react";
import Header from "./header";
import Api from "../../services/Api";

// Helper: format tanggal ke "DD MMMM YYYY" (Indonesia)
const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    } catch {
        return dateString;
    }
};

// Helper: format waktu ke "HH:MM" (ambil jam:menit dari string atau Date)
const formatTime = (timeString) => {
    if (!timeString) return "-";
    try {
        // Jika sudah berupa "14:00" atau "14:00:00"
        if (timeString.match(/^\d{1,2}:\d{2}/)) {
            return timeString.slice(0, 5);
        }
        // Jika berupa tanggal penuh, ambil jam:menit
        const date = new Date(timeString);
        if (!isNaN(date.getTime())) {
            return new Intl.DateTimeFormat("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }).format(date);
        }
        return timeString;
    } catch {
        return timeString;
    }
};

const DetailCourseCustomer = () => {
    document.title = "Detail Course - Saiful Training";

    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetailCourse = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await Api.get(`/api/courses/${slug}`, {
                    headers: {
                        Accept: "application/json",
                    },
                });
                setCourse(response.data.data[0]);
            } catch (err) {
                setError("Gagal memuat data course. Silakan coba lagi.");
                console.error("Error fetching course detail:", err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchDetailCourse();
        }
    }, [slug]);

    // Breadcrumb items
    const breadcrumbs = [
        { label: "Home", href: "/", icon: Home },
        { label: "Course", href: "/courses" },
        { label: course?.title || "Detail", href: null },
    ];

    if (loading) {
        return (
            <>
                <Header />
                <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
                        <p className="mt-4 text-gray-600 font-medium">Memuat detail course...</p>
                    </div>
                </main>
            </>
        );
    }

    if (error || !course) {
        return (
            <>
                <Header />
                <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <div className="text-red-600 text-5xl mb-4">😕</div>
                        <h2 className="text-xl font-bold text-red-700 mb-2">
                            {error || "Course tidak ditemukan"}
                        </h2>
                        <p className="text-red-600 mb-4">
                            Maaf, kami tidak dapat menemukan course yang Anda cari.
                        </p>
                        <a
                            href="/courses"
                            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
                        >
                            Lihat Semua Course
                        </a>
                    </div>
                </main>
            </>
        );
    }

    // Format data untuk tampilan
    const formattedDate = formatDate(course.date);
    const formattedTime = formatTime(course.time);

    return (
        <>
            <Header />
            <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
                {/* Breadcrumb */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        {breadcrumbs.map((item, index) => (
                            <span key={index} className="flex items-center gap-2">
                                {index > 0 && <span className="text-gray-300">/</span>}
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        className="hover:text-amber-700 flex items-center gap-1 transition-colors"
                                    >
                                        {item.icon && <item.icon className="w-4 h-4" />}
                                        {item.label}
                                    </a>
                                ) : (
                                    <span className="text-gray-800 font-medium flex items-center gap-1">
                                        {item.icon && <item.icon className="w-4 h-4" />}
                                        {item.label}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                    <div className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {course.status || "Aktif"}
                    </div>
                </div>

                {/* Hero Header */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100 mb-10">
                    <div className="p-6 md:p-10">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                            <span className="text-amber-700">{course.title}</span>
                        </h1>
                        <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <CalendarDays className="w-5 h-5 text-amber-600" />
                                {formattedDate}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-5 h-5 text-amber-600" />
                                {formattedTime} WIB - Selesai
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-5 h-5 text-amber-600" />
                                Google Meet (Online)
                            </div>
                        </div>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-amber-600 to-orange-600"></div>
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <BarChart3 className="w-7 h-7 text-amber-600" />
                                Overview
                            </h2>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                {course.description || "Deskripsi course belum tersedia."}
                            </p>
                        </div>

                        {/* Materi */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Gift className="w-7 h-7 text-amber-600" />
                                Materi yang dipelajari
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                                {course.materials?.length > 0 ? (
                                    course.materials.map((learning, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors group"
                                        >
                                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 group-hover:bg-amber-200 transition-colors">
                                                <Check className="w-4 h-4" /> {/* Changed from Folder to Check */}
                                            </div>
                                            <span className="font-medium text-gray-800">
                                                {learning.learning_list}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl col-span-full">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                            <FileX className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-gray-500">
                                            Belum ada list materi yang akan dipelajari
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
                                <Info className="w-5 h-5 text-amber-600" />
                                Event Information
                            </h3>
                            <div className="space-y-4 mt-4">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="text-gray-500 text-sm flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Tanggal
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        {formattedDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="text-gray-500 text-sm flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Waktu
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        {formattedTime} WIB
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        Lokasi
                                    </span>
                                    <span className="font-semibold text-gray-800 text-sm">
                                        Online (Google Meet)
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                                <Link to={`/course/detail/${course.slug}/order`}>
                                    <button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-lg cursor-pointer">
                                    <Rocket className="w-5 h-5" />
                                    Daftar Sekarang
                                </button>
                                </Link>
                                <p className="text-xs text-gray-400 text-center mt-3">
                                    *Sertifikat digital + akses rekaman 30 hari
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                        <Users className="w-4 h-4" />
                        Bergabunglah dengan 500+ peserta yang telah meningkatkan karir bersama
                        <span className="font-semibold text-amber-700">
                            SAIFUL TRAINING CONSULTING
                        </span>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-16">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
                    <div className="flex flex-col md:flex-row justify-between gap-8 items-center md:items-start border-b border-gray-800 pb-8">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-8 w-8 rounded-xl bg-amber-600 flex items-center justify-center">
                                    <span className="text-white font-bold">S</span>
                                </div>
                                <span className="text-xl font-bold text-white">
                                    SAIFUL TRAINING CONSULTING
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm max-w-xs text-center md:text-left">
                                Mitra pelatihan untuk guru, yayasan, dan profesional data.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-8 text-sm">
                            <div>
                                <h4 className="font-semibold text-white mb-3">Tentang</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
                                            <Briefcase className="w-3 h-3" />
                                            Karir
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
                                            <Newspaper className="w-3 h-3" />
                                            Blog
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-3">Program</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
                                            <BarChart2 className="w-3 h-3" />
                                            Course Data
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
                                            <Bot className="w-3 h-3" />
                                            Workshop AI
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-3">Bantuan</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
                                            <Phone className="w-3 h-3" />
                                            Hubungi Kami
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
                                            <HelpCircle className="w-3 h-3" />
                                            FAQ
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 text-center text-gray-500 text-sm">
                        &copy; 2026 SAIFUL TRAINING CONSULTING. All rights reserved.
                    </div>
                </div>
            </footer>
        </>
    );
};

export default DetailCourseCustomer;