import { Edit2, Award, Presentation, Video, MessageCircle, UploadIcon } from "lucide-react";
import Header from "./header";
import Api from "../../services/Api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const MyProfile = () => {
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  document.title = "Profile - Saiful Trainer";

  const fetchUser = async () => {
    try {
      const response = await Api.get("/api/profile", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setUser(response.data.data[0]);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500">Memuat profil...</p>
        </div>
      </>
    );
  }

  if (!User) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-red-500">Gagal memuat data pengguna.</p>
        </div>
      </>
    );
  }

  const handleDownload = (item) => {
    alert(`Mengunduh ${item} (demo)`);
  };

  const handleUploadBukti = () => {
    alert("Fungsi upload bukti pembayaran (demo)");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar Profil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={User.avatar || "https://randomuser.me/api/portraits/men/45.jpg"}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover border-4 border-amber-300 shadow-md"
                  />
                  <button className="absolute bottom-1 right-1 bg-amber-600 rounded-full p-1.5 shadow-md hover:bg-amber-700 transition">
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-800">{User.name}</h2>
                <p className="text-gray-500 text-sm">{User.email}</p>
                <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1">
                  <Edit2 className="w-4 h-4" /> +62 812 3456 7890
                </p>
                <div className="mt-3 bg-amber-50 rounded-full px-3 py-1 text-amber-700 text-xs font-medium">
                  Member sejak {formatDate(User.created_at)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Edit2 className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">Jakarta, Indonesia</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Edit2 className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">Data Analyst Freelance</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Edit2 className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">Mahasiswa / Profesional</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full border border-amber-300 bg-white hover:bg-amber-50 text-amber-700 font-semibold py-2 rounded-xl transition flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" /> Edit Profil
                </button>
              </div>
            </div>
          </div>

          {/* Daftar Course */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Edit2 className="w-7 h-7 text-amber-600" /> Course Saya
              </h1>
              <div className="bg-amber-50 rounded-full px-3 py-1 text-sm text-amber-700">
                Total {User.orders?.length || 0} course aktif
              </div>
            </div>

            {User.orders && User.orders.length > 0 ? (
              User.orders.map((order) => (
                <div
                  key={order.id || order.course?.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                >
                  {/* Header Course */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <img
                          src={order.course?.image || "https://via.placeholder.com/40"}
                          alt={order.course?.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800">{order.course?.title}</h3>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Edit2 className="w-3 h-3" /> 15-16 Mei 2026
                            </span>
                            <span className="flex items-center gap-1">
                              <Edit2 className="w-3 h-3" /> 19:30 WIB
                            </span>
                            <span className="flex items-center gap-1">
                              <Edit2 className="w-3 h-3" /> Zoom Meeting (Online)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi - sesuai status pembayaran */}
                  <div className="p-4 flex flex-wrap gap-3 border-b border-gray-100">
                    {order.payment_option === "pay_now" ? (
                      // Sudah lunas → tampilkan tombol download
                      <>
                        {/* Sertifikat */}
                        {order.is_certificate ? (
                          order.certificate_file ? (
                            <button
                              onClick={() => handleDownload("sertifikat")}
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
                            onClick={() => handleDownload("slide")}
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

                        {/* Video */}
                        {order.course?.video ? (
                          <button
                            onClick={() => handleDownload("video")}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2 shadow-sm"
                          >
                            <Video className="w-5 h-5" /> Download Video
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-rose-100 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm cursor-not-allowed"
                          >
                            <Video className="w-5 h-5" /> Video belum tersedia
                          </button>
                        )}
                      </>
                    ) : (
                      // Belum lunas → tampilkan tombol upload bukti pembayaran saja
                      <button
                        onClick={handleUploadBukti}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2 shadow-sm"
                      >
                        <UploadIcon className="w-5 h-5" /> Upload Bukti Pembayaran
                      </button>
                    )}
                  </div>

                  {/* Tombol Grup WA & Link Zoom (tetap muncul) */}
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
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
                <p className="text-gray-500">Belum ada kelas yang diikuti.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default MyProfile;