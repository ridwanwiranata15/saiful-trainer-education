import { CheckCircle2Icon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "../../services/Api";

const PaymentSuccess = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [course, setCourse] = useState(null);
    const [order, SetOrder] = useState(null);
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
                SetOrder(response.data.data[0].orders[0]);

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
    return (<>
        <main class="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">

            <div class="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden">

                <div class="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 text-center">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-2 success-icon">
                        <CheckCircle2Icon class="w-12 h-12 text-amber-600" />
                    </div>
                    <h1 class="text-2xl md:text-3xl font-bold text-white">Pembayaran Berhasil!</h1>
                    <p class="text-amber-100 mt-1">Terima kasih telah mempercayakan pelatihan kepada kami</p>
                </div>

                <div class="p-6 md:p-8">
                    <div class="border-b border-gray-100 pb-6">
                        <div class="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <p class="text-sm text-gray-500">No. Invoice</p>
                                <p class="font-mono font-bold text-gray-800">STC/DA/2026/0517-001</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-500">Tanggal Transaksi</p>
                                <p class="font-semibold text-gray-800">17 Mei 2026, 14:32 WIB</p>
                            </div>
                        </div>
                    </div>


                    <div class="py-6 border-b border-gray-100">
                        <h2 class="font-bold text-gray-800 flex items-center gap-2"><i data-lucide="book-open" class="w-5 h-5 text-amber-600"></i> Detail Course</h2>
                        <div class="mt-3 bg-gray-50 rounded-xl p-4">
                            <p class="font-semibold text-gray-800">{course?.title}</p>
                            <div class="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-4 h-4"></i>{formatDate(course?.date)}</span>
                                <span class="flex items-center gap-1"><i data-lucide="clock" class="w-4 h-4"></i> {formatTime(course?.time)} WIB</span>
                                <span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-4 h-4"></i> Google Meet</span>
                            </div>
                        </div>


                        <div class="mt-4">
                            <p class="font-semibold text-gray-700">Paket Tambahan:</p>
                            <div class="flex items-center gap-2 mt-1 text-green-700 bg-green-50 w-fit px-3 py-1 rounded-full text-sm">
                                <i data-lucide="award" class="w-4 h-4"></i> Sertifikat + Slide Materi + Video Materi
                            </div>
                        </div>
                    </div>


                    <div class="py-6 border-b border-gray-100">
                        <h2 class="font-bold text-gray-800 flex items-center gap-2"><i data-lucide="receipt" class="w-5 h-5 text-amber-600"></i> Ringkasan Pembayaran</h2>
                        <div class="mt-3 space-y-2">
                            <div class="flex justify-between text-gray-600"><span>Paket Course (Workshop)</span><span>Rp 0</span></div>
                            <div class="flex justify-between text-gray-600"><span>Paket Lengkap (Sertifikat + Slide + Video)</span><span>Rp 99.000</span></div>
                            <div class="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-800"><span>Total Dibayar</span><span class="text-amber-700 text-xl">Rp 99.000</span></div>
                        </div>
                        <div class="mt-3 bg-green-50 rounded-lg p-3 text-green-700 text-sm flex items-center gap-2">
                            <i data-lucide="credit-card" class="w-4 h-4"></i> Metode Pembayaran: Transfer Bank (Virtual Account) - Sudah dikonfirmasi
                        </div>
                    </div>


                    <div class="py-6">
                        <h2 class="font-bold text-gray-800 flex items-center gap-2"><i data-lucide="mail" class="w-5 h-5 text-amber-600"></i> Instruksi Akses Course</h2>
                        <div class="mt-3 space-y-3 text-gray-600">
                            <p><i data-lucide="check-circle" class="w-4 h-4 text-green-600 inline mr-2"></i> Informasi akses Google Meet & grup diskusi akan dikirim ke email terdaftar dalam 1x24 jam.</p>
                            <p><i data-lucide="check-circle" class="w-4 h-4 text-green-600 inline mr-2"></i> Materi slide & video rekaman dapat diakses melalui dashboard member setelah acara selesai.</p>
                            <p><i data-lucide="check-circle" class="w-4 h-4 text-green-600 inline mr-2"></i> Sertifikat digital akan tersedia di dashboard maksimal 7 hari setelah workshop.</p>
                        </div>
                    </div>


                    <div class="flex flex-col sm:flex-row gap-4 pt-4">
                        <a href="profile.html" class="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2">
                            <i data-lucide="layout-dashboard" class="w-5 h-5"></i> Lihat Dashboard
                        </a>
                        <a href="index.html" class="border border-amber-300 bg-white hover:bg-amber-50 text-amber-800 font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2">
                            <i data-lucide="home" class="w-5 h-5"></i> Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </div>


            <div class="text-center mt-8 text-gray-500 text-sm">
                <p>Ada pertanyaan? <a href="#" class="text-amber-700 hover:underline">Hubungi Tim Support</a></p>
            </div>
        </main>
    </>);
}

export default PaymentSuccess;