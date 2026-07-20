import {
  Edit2,
  Award,
  Presentation,
  Video,
  MessageCircle,
  Upload,
  X,
  Loader2,
  MapPin,
  Briefcase,
  Calendar,
  LogOutIcon,
  Download,
} from "lucide-react";
import Header from "./header";
import Api from "../../services/Api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // State untuk modal upload bukti
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // State untuk modal video
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  // Set judul halaman
  useEffect(() => {
    document.title = "Profile - Saiful Trainer";
  }, []);

  // ============================================
  // FETCH USER DATA
  // ============================================
  const fetchUser = async () => {
    try {
      const response = await Api.get("/api/profile", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const userData = response.data.data?.[0] || null;
      setUser(userData);
      console.log(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ============================================
  // LOGOUT
  // ============================================
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("permissions");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ============================================
  // DOWNLOAD FILE (BUKA TAB BARU)
  // ============================================
  const handleDownload = (url, filename) => {
    if (!url) {
      toast.error("URL file tidak tersedia.");
      return;
    }
    window.open(url, "_blank");
  };

  // ============================================
  // BUKA MODAL VIDEO
  // ============================================
  const openVideoModal = (url, title) => {
    if (!url) {
      toast.error("Video tidak tersedia.");
      return;
    }
    setVideoUrl(url);
    setVideoTitle(title || "Video");
    setVideoModalOpen(true);
  };

  // ============================================
  // FORMAT TANGGAL
  // ============================================
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ============================================
  // UPLOAD BUKTI PEMBAYARAN
  // ============================================
  const openUploadModal = (order) => {
    setSelectedOrder(order);
    setFile(null);
    setUploadError("");
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setUploadError("Ukuran file maksimal 10MB");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setUploadError("");
    } else {
      setFile(null);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Pilih file terlebih dahulu");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("payment_proof_path", file);
      formData.append("user_id", user.id);
      formData.append("course_id", selectedOrder.course_id);
      formData.append("payment_option", "pay_now");
      formData.append("_method", "PUT");

      await Api.post(`/api/order/${selectedOrder.id}`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchUser();
      setModalOpen(false);
      toast.success("Bukti pembayaran berhasil diunggah!");
    } catch (error) {
      console.error("Upload gagal:", error.response);
      setUploadError("Gagal mengunggah bukti. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // CEK STATUS PEMBAYARAN
  // ============================================
  const getPaymentStatus = (order) => {
    if (!order.payment_option || order.payment_option !== "pay_now") {
      return "belum_upload";
    }
    // Asumsikan ada field 'status' pada order: pending, approved, rejected
    return order.status || "pending"; // default pending jika belum ada status
  };

  // Helper untuk badge status
  const renderStatusBadge = (status) => {
    const statusMap = {
      belum_upload: { label: "Belum Bayar", className: "bg-gray-200 text-gray-700" },
      pending: { label: "Menunggu Verifikasi", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Pembayaran Diverifikasi", className: "bg-green-100 text-green-800" },
      rejected: { label: "Ditolak", className: "bg-red-100 text-red-800" },
    };
    const info = statusMap[status] || statusMap.belum_upload;
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${info.className}`}>
        {info.label}
      </span>
    );
  };

  // ============================================
  // RENDER LOADING
  // ============================================
  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
            <p className="mt-4 text-gray-600 font-medium">Memuat profil Anda...</p>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // RENDER ERROR
  // ============================================
  if (!user) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-red-600 text-5xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Gagal memuat data pengguna
            </h2>
            <p className="text-red-600">Silakan coba lagi nanti.</p>
          </div>
        </div>
      </>
    );
  }

  const orders = user.orders || [];
  const avatarUrl = user.photo || user.avatar || user.profile_photo_url || null;

  // Base URL untuk asset storage (otomatis menggunakan domain saat ini)
  const baseUrl = 'http://127.0.0.1:8000';

  // ============================================
  // RENDER UTAMA
  // ============================================
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ===== SIDEBAR PROFIL ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={
                      avatarUrl ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(user.name) +
                        "&background=amber&color=fff&size=128"
                    }
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover border-4 border-amber-300 shadow-md"
                  />
                  <button className="absolute bottom-1 right-1 bg-amber-600 rounded-full p-1.5 shadow-md hover:bg-amber-700 transition">
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1">
                  <Edit2 className="w-4 h-4" /> +62 812 3456 7890
                </p>
                <div className="mt-3 bg-amber-50 rounded-full px-3 py-1 text-amber-700 text-xs font-medium">
                  Member sejak {formatDate(user.created_at)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">Jakarta, Indonesia</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">Data Analyst Freelance</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">Mahasiswa / Profesional</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full border border-red-300 bg-white hover:bg-red-50 text-red-700 font-semibold py-2 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <LogOutIcon className="w-4 h-4" />
                  {isLoggingOut ? "Logging out..." : "Log Out"}
                </button>
              </div>
            </div>
          </div>

          {/* ===== DAFTAR COURSE ===== */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Edit2 className="w-7 h-7 text-amber-600" /> Course Saya
              </h1>
              <div className="bg-amber-50 rounded-full px-3 py-1 text-sm text-amber-700">
                Total {orders.length} course aktif
              </div>
            </div>

            {orders.length > 0 ? (
              orders.map((order) => {
                const status = getPaymentStatus(order);
                const isPaid = status === 'approved';
                const isPending = status === 'pending';
                const isRejected = status === 'rejected';
                const isBelumUpload = status === 'belum_upload';

                return (
                  <div
                    key={order.id || order.course?.id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                  >
                    {/* Header Course dengan Status - hide badge jika is_certificate === 0 */}
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <img
                            src={order.course?.image || "https://via.placeholder.com/40"}
                            alt={order.course?.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {order.course?.title}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> 15-16 Mei 2026
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> 19:30 WIB
                              </span>
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" /> Zoom Meeting (Online)
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Badge Status - hanya jika is_certificate bernilai true (1) */}
                        {!!order.is_certificate && (
                          <div className="flex-shrink-0">
                            {renderStatusBadge(status)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ========================================================== */}
                    {/* TOMBOL AKSI (Upload, Pending, Rejected, Paid) - ONLY if is_certificate */}
                    {/* ========================================================== */}
                    {!!order.is_certificate && (
                      <div className="p-4 flex flex-wrap gap-3 border-b border-gray-100">
                        {isBelumUpload && (
                          <button
                            onClick={() => openUploadModal(order)}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2 shadow-sm"
                          >
                            <Upload className="w-5 h-5" /> Upload Bukti Pembayaran
                          </button>
                        )}

                        {isPending && (
                          <button
                            disabled
                            className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-not-allowed"
                          >
                            <Loader2 className="w-5 h-5 animate-spin" /> Menunggu Verifikasi
                          </button>
                        )}

                        {isRejected && (
                          <>
                            <button
                              onClick={() => openUploadModal(order)}
                              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2 shadow-sm"
                            >
                              <Upload className="w-5 h-5" /> Upload Ulang Bukti
                            </button>
                            <span className="text-sm text-red-600 flex items-center">
                              Bukti ditolak, silakan upload ulang.
                            </span>
                          </>
                        )}

                        {isPaid && (
                          <>
                            {/* Sertifikat */}
                            {order.is_certificate ? (
                              order.certificate_file ? (
                                <button
                                  onClick={() =>
                                    handleDownload(
                                      `${baseUrl}/storage/orders/certificates/${order.certificate_file}`
                                    )
                                  }
                                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2 shadow-sm"
                                >
                                  <Award className="w-5 h-5" /> Download Sertifikat
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="bg-purple-300 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-not-allowed"
                                >
                                  <Award className="w-5 h-5" /> Sertifikat belum tersedia
                                </button>
                              )
                            ) : null}

                            {/* Slide */}
                            {order.course?.material_path ? (
                              <button
                                onClick={() =>
                                  handleDownload(
                                    `${baseUrl}/storage/courses/materials/${order.course.material_path}`
                                  )
                                }
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2 shadow-sm"
                              >
                                <Presentation className="w-5 h-5" /> Download Slide
                              </button>
                            ) : (
                              <button
                                disabled
                                className="bg-indigo-300 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-not-allowed"
                              >
                                <Presentation className="w-5 h-5" /> Slide belum tersedia
                              </button>
                            )}

                            {/* Video - Buka Modal */}
                            {order.course?.video ? (
                              <button
                                onClick={() =>
                                  openVideoModal(
                                    `http://127.0.0.1:8000/storage/courses/video/${order.course.video}`,
                                    order.course.title
                                  )
                                }
                                className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2 shadow-sm"
                              >
                                <Video className="w-5 h-5" /> Putar Video
                              </button>
                            ) : (
                              <button
                                disabled
                                className="bg-rose-300 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-not-allowed"
                              >
                                <Video className="w-5 h-5" /> Video belum tersedia
                              </button>
                            )}

                            {/* Jika tidak ada satupun file */}
                           
                          </>
                        )}
                      </div>
                    )}

                    {/* ========================================================== */}
                    {/* TOMBOL GRUP WA & ZOOM - SELALU TAMPIL */}
                    {/* ========================================================== */}
                    <div className="p-4 flex flex-wrap gap-3">
                      <a
                        href="https://wa.me/6281234567890?text=Halo%20saya%20peserta%20Data%20Analyst%20Workshop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2 shadow-sm"
                      >
                        <MessageCircle className="w-5 h-5" /> Grup WhatsApp
                      </a>
                      <a
                        href="https://zoom.us/j/1234567890?pwd=example"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2 shadow-sm"
                      >
                        <Video className="w-5 h-5" /> Link Zoom Meeting
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
                <p className="text-gray-500">Belum ada kelas yang diikuti.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ===== MODAL UPLOAD BUKTI ===== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">
                Upload Bukti Pembayaran
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
                disabled={uploading}
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  File Bukti Transfer (max 10MB)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  disabled={uploading}
                />
                {file && (
                  <p className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                    <Upload className="size-4" /> {file.name}
                  </p>
                )}
                {uploadError && (
                  <p className="mt-1 text-sm text-red-500">{uploadError}</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={uploading}
                  className="px-5 py-2.5 rounded-xl font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading && <Loader2 className="size-4 animate-spin" />}
                  {uploading ? "Mengunggah..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL VIDEO PLAYER ===== */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900 truncate">
                {videoTitle || "Video Player"}
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="p-4 bg-black">
              <video
                src={videoUrl}
                controls
                className="w-full max-h-[70vh] rounded-lg"
                autoPlay
              >
                Browser Anda tidak mendukung pemutaran video.
              </video>
            </div>

            {/* Tombol Aksi */}
            <div className="p-5 border-t border-gray-200 flex flex-wrap items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  handleDownload(videoUrl);
                  setVideoModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Video
              </button>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyProfile;