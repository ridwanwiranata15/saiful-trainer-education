import React, { useState, useEffect, useRef } from "react";
import Header from "./header";
import {
    Home,
    BookOpen,
    CalendarDays,
    MapPin,
    Wrench,
    CheckCircle,
    Dot,
    ShoppingCart,
    CreditCard,
    UploadCloud,
    Eye,
    Loader2, // <-- added for spinners
} from "lucide-react";
import { useParams } from "react-router-dom";
import Api from "../../services/Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const OrderCourse = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [course, setCourse] = useState(null);
    const [user, setUser] = useState(null);

    // State untuk UI
    const [isChecked, setIsChecked] = useState(false);
    const [showPaymentOption, setShowPaymentOption] = useState(false);
    const [paymentChoice, setPaymentChoice] = useState(null);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false); // <-- new state for button loading

    // State untuk data order
    const [orderData, setOrderData] = useState({
        course_id: null,
        user_id: null,
        is_certificate: 0,
        payment_option: '',
        payment_proof: null, // akan berisi file object
    });

    const fileInputRef = useRef(null);

    // Fetch user dari cookie
    const fetchUser = () => {
        try {
            const userCookie = Cookies.get("user");
            if (userCookie) {
                const parsedUser = JSON.parse(userCookie);
                setUser(parsedUser);
                setOrderData(prev => ({ ...prev, user_id: parsedUser?.id }));
            }
        } catch {
            setUser(null);
        }
    };

    // Fetch course detail
    useEffect(() => {
        const fetchDetailCourse = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await Api.get(`/api/courses/${slug}`, {
                    headers: { Accept: "application/json" },
                });
                const courseData = response.data.data[0];
                setCourse(courseData);
                setOrderData(prev => ({ ...prev, course_id: courseData?.id }));
            } catch (err) {
                setError("Gagal memuat data course. Silakan coba lagi.");
                console.error("Error fetching course detail:", err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchDetailCourse();
            fetchUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    // Handler checkbox
    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsChecked(checked);
        if (checked) {
            // Centang: paket sertifikat dipilih
            setShowPaymentOption(true);
            setPaymentChoice(null);
            setShowUploadForm(false);
            setFile(null);
            setPreviewUrl(null);
            setOrderData(prev => ({
                ...prev,
                is_certificate: 1, // 1 berarti memilih sertifikat
                payment_option: '',
                payment_proof: null,
            }));
        } else {
            // Tidak centang: reset semua
            setShowPaymentOption(false);
            setPaymentChoice(null);
            setShowUploadForm(false);
            setFile(null);
            setPreviewUrl(null);
            setOrderData(prev => ({
                ...prev,
                is_certificate: 0,
                payment_option: '',
                payment_proof: null,
            }));
        }
    };

    // Handler bayar sekarang
    const handleBayarSekarang = () => {
        setPaymentChoice("sekarang");
        setShowUploadForm(true);
        setOrderData(prev => ({ ...prev, payment_option: "pay_now" }));
        // Reset file jika sebelumnya ada
        setFile(null);
        setPreviewUrl(null);
        setOrderData(prev => ({ ...prev, payment_proof: null }));
    };

    // Handler bayar nanti
    const handleBayarNanti = () => {
        setPaymentChoice("nanti");
        setShowUploadForm(false);
        setFile(null);
        setPreviewUrl(null);
        setOrderData(prev => ({ ...prev, payment_option: "pay_later", payment_proof: null }));
    };

    // Handler upload file
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
            setOrderData(prev => ({ ...prev, payment_proof: selectedFile }));
        } else {
            setFile(null);
            setPreviewUrl(null);
            setOrderData(prev => ({ ...prev, payment_proof: null }));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Handler daftar
    const handleDaftar = async () => {
        // Validasi
        const token = Cookies.get('token');
        if (!isChecked) {
            toast.error("Silakan centang paket tambahan terlebih dahulu.");
            return;
        }
        if (!paymentChoice) {
            toast.error("Silakan pilih metode pembayaran (Bayar Sekarang atau Bayar Nanti).");
            return;
        }
        if (paymentChoice === "sekarang" && !file) {
            toast.error("Harap upload bukti pembayaran.");
            return;
        }

        setSubmitting(true); // <-- start loading

        // Siapkan FormData untuk upload file
        const formData = new FormData();
        formData.append("course_id", orderData.course_id);
        formData.append("user_id", orderData.user_id);
        formData.append("is_certificate", orderData.is_certificate);
        formData.append("payment_option", orderData.payment_option);
        if (file) {
            formData.append("payment_proof", file);
        }

        try {
            // Kirim data ke server
            const response = await Api.post("/api/order", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization":`Bearer ${token}`
                },
            });
            toast.success("Pesanan berhasil! Silakan cek email untuk konfirmasi.");
            window.location.href = `/course/detail/${course.slug}/order/payment/success`;
        } catch (err) {
            toast.error("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.");
            console.error("Error creating order:", err.response);
        } finally {
            setSubmitting(false); // <-- stop loading
        }
    };

    // Helper format date/time
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

    const formatTime = (timeString) => {
        if (!timeString) return "-";
        try {
            if (timeString.match(/^\d{1,2}:\d{2}/)) {
                return timeString.slice(0, 5);
            }
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

    // Improved loading UI
    if (loading) {
        return (
            <>
                <Header />
                <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
                        <p className="mt-4 text-gray-600 font-medium">Memuat halaman pemesanan...</p>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <div className="text-red-600 text-5xl mb-4">😕</div>
                        <h2 className="text-xl font-bold text-red-700 mb-2">Gagal memuat data</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* KIRI: Detail Course */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-amber-100">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-6 h-6 text-amber-600" />
                                <h2 className="text-xl font-bold text-gray-800">Detail Course</h2>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                {course?.title || "Judul Course"}
                            </h1>

                            <div className="mt-4 space-y-3 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5 text-amber-600" />
                                    {formatDate(course?.date)} | {formatTime(course?.time)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-amber-600" /> Google Meet (Online)
                                </div>
                                <div className="flex items-center gap-2">
                                    <Wrench className="w-5 h-5 text-amber-600" /> Google Colab, Python, Pandas
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <img
                                        src="https://randomuser.me/api/portraits/women/68.jpg"
                                        alt="Clara Mia Devira"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">Clara Mia Devira</p>
                                        <p className="text-sm text-gray-500">Data Analyst | Founder datawithclara</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-amber-600" /> Apa yang akan kamu pelajari?
                            </h3>
                            <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                {course?.materials && course.materials.length > 0 ? (
                                    course.materials.map((m, idx) => (
                                        <li key={idx} className="flex gap-2">
                                            <Dot className="w-4 h-4 text-amber-500" /> {m.learning_list}
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex gap-2">
                                        <Dot className="w-4 h-4 text-amber-500" /> Belum ada list materi
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* KANAN: Checkout Card */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-amber-100">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingCart className="w-6 h-6 text-amber-600" /> Checkout
                            </h2>

                            {/* Paket tambahan */}
                            <div className="mt-6 border-b border-gray-200 pb-4">
                                <p className="font-semibold text-gray-700 mb-3">Tambahan materi & sertifikat:</p>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                        className="mt-1 w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-800">
                                            Paket Lengkap (Sertifikat + Slide Materi + Video Materi)
                                        </span>
                                        <p className="text-sm text-gray-500">Akses materi tambahan & sertifikat digital</p>
                                        <p className="text-amber-700 font-bold text-sm mt-1">Rp 99.000</p>
                                    </div>
                                </label>
                            </div>

                            {/* Opsi Bayar Sekarang / Nanti */}
                            {showPaymentOption && (
                                <div className="mt-4">
                                    <p className="font-semibold text-gray-700 mb-2">Pilih metode pembayaran:</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleBayarSekarang}
                                            className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${
                                                paymentChoice === "sekarang"
                                                    ? "border-amber-600 bg-amber-50 text-amber-700"
                                                    : "border-gray-300 hover:border-amber-400"
                                            }`}
                                        >
                                            Bayar Sekarang
                                        </button>
                                        <button
                                            onClick={handleBayarNanti}
                                            className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${
                                                paymentChoice === "nanti"
                                                    ? "border-amber-600 bg-amber-50 text-amber-700"
                                                    : "border-gray-300 hover:border-amber-400"
                                            }`}
                                        >
                                            Bayar Nanti
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Total Harga */}
                            {isChecked && (
                                <div className="mt-4">
                                    <div className="bg-amber-50 rounded-xl p-4 flex justify-between items-center">
                                        <span className="font-semibold text-gray-700">Total yang harus dibayar:</span>
                                        <span className="text-2xl font-bold text-amber-700">Rp 99.000</span>
                                    </div>
                                </div>
                            )}

                            {/* Form Upload Bukti */}
                            {showUploadForm && (
                                <div className="mt-5">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Bukti Pembayaran
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-amber-400 transition">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="flex flex-col items-center gap-1 w-full cursor-pointer"
                                            >
                                                <UploadCloud className="w-8 h-8 text-gray-400" />
                                                <span className="text-sm text-gray-500">Klik untuk upload</span>
                                                <span className="text-xs text-gray-400">JPG, PNG, PDF (max 2MB)</span>
                                            </button>
                                        </div>

                                        {previewUrl && (
                                            <div className="mt-3 flex items-center gap-3">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview bukti pembayaran"
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                />
                                                <span className="text-sm text-gray-600">{file?.name}</span>
                                            </div>
                                        )}
                                        {file && !previewUrl && (
                                            <p className="text-sm text-gray-600 mt-2">📎 {file.name}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tombol Daftar with loading state */}
                            <button
                                onClick={handleDaftar}
                                disabled={submitting}
                                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Daftar sekarang
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-400 text-center mt-3">
                                *Centang paket tambahan untuk melanjutkan
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default OrderCourse;