import {
  CheckCircle2Icon,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Award,
  Receipt,
  CreditCard,
  Mail,
  CheckCircle,
  LayoutDashboard,
  Home,
  Loader2, // <-- added
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Api from "../../services/Api";

const PaymentSuccess = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchDetailCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await Api.get(`/api/courses/${slug}`, {
          headers: { Accept: "application/json" },
        });
        const courseData = response.data.data?.[0] || null;
        setCourse(courseData);
        setOrder(courseData?.orders?.[0] || null);
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

  // Improved loading UI
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">
            Memuat data pembayaran...
          </p>
        </div>
      </div>
    );
  }

  // Jika error atau tidak ada data course/order
  if (error || !course || !order) {
    return (
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="text-red-600 text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            {error || "Data pembayaran tidak ditemukan."}
          </h2>
          <Link
            to="/"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors mt-4"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Data dari order
  const invoiceNumber = order.invoice_number || "STC/DA/2026/0517-001";
  const transactionDate = order.created_at
    ? `${formatDate(order.created_at)}, ${formatTime(order.created_at)} WIB`
    : "17 Mei 2026, 14:32 WIB";
  const basePrice = order.base_price || 0;
  const extraPrice = "99000";
  const totalPrice = "99000";
  const hasCertificate = order.is_certificate || false;
  const paymentMethod = order.payment_method || "Transfer Bank (Virtual Account)";

  return (
    <main className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20">
      <div className="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-2 success-icon">
            <CheckCircle2Icon className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Pembayaran Berhasil!
          </h1>
          <p className="text-amber-100 mt-1">
            Terima kasih telah mempercayakan pelatihan kepada kami
          </p>
        </div>

        <div className="p-6 md:p-8">
          {/* Invoice & Tanggal */}
          <div className="border-b border-gray-100 pb-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <p className="text-sm text-gray-500">No. Invoice</p>
                <p className="font-mono font-bold text-gray-800">
                  {invoiceNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Tanggal Transaksi</p>
                <p className="font-semibold text-gray-800">{transactionDate}</p>
              </div>
            </div>
          </div>

          {/* Detail Course */}
          <div className="py-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              Detail Course
            </h2>
            <div className="mt-3 bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800">{course.title}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(course.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(course.time)} WIB
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Google Meet
                </span>
              </div>
            </div>

            {hasCertificate && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">Paket Tambahan:</p>
                <div className="flex items-center gap-2 mt-1 text-green-700 bg-green-50 w-fit px-3 py-1 rounded-full text-sm">
                  <Award className="w-4 h-4" />
                  Sertifikat + Slide Materi + Video Materi
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="py-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-600" />
              Ringkasan Pembayaran
            </h2>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Paket Course (Workshop)</span>
                <span>Rp {basePrice.toLocaleString("id-ID")}</span>
              </div>
              {hasCertificate && (
                <div className="flex justify-between text-gray-600">
                  <span>Paket Lengkap (Sertifikat + Slide + Video)</span>
                  <span>Rp {extraPrice.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-800">
                <span>Total Dibayar</span>
                <span className="text-amber-700 text-xl">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <div className="mt-3 bg-green-50 rounded-lg p-3 text-green-700 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Metode Pembayaran: {paymentMethod} - Sudah dikonfirmasi
            </div>
          </div>

          {/* Instruksi Akses */}
          <div className="py-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-600" />
              Instruksi Akses Course
            </h2>
            <div className="mt-3 space-y-3 text-gray-600">
              <p>
                <CheckCircle className="w-4 h-4 text-green-600 inline mr-2" />
                Informasi akses Google Meet & grup diskusi akan dikirim ke email
                terdaftar dalam 1x24 jam.
              </p>
              <p>
                <CheckCircle className="w-4 h-4 text-green-600 inline mr-2" />
                Materi slide & video rekaman dapat diakses melalui dashboard
                member setelah acara selesai.
              </p>
              <p>
                <CheckCircle className="w-4 h-4 text-green-600 inline mr-2" />
                Sertifikat digital akan tersedia di dashboard maksimal 7 hari
                setelah workshop.
              </p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/profile"
              className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              Lihat Dashboard
            </Link>
            <Link
              to="/"
              className="border border-amber-300 bg-white hover:bg-amber-50 text-amber-800 font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Support */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>
          Ada pertanyaan?{" "}
          <a href="#" className="text-amber-700 hover:underline">
            Hubungi Tim Support
          </a>
        </p>
      </div>
    </main>
  );
};

export default PaymentSuccess;