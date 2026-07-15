import { useParams } from "react-router-dom";
import Api from "../../services/Api";
import AdminLayout from "./layouts";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  Image,
  BookOpen,
  CalendarDaysIcon,
  ClockCheckIcon,
  AlignLeft,
  PlayCircle,
  VideoOffIcon,
  FileIcon,
  FileX2Icon,
  Phone,
  LucidePhoneMissed,
  Video,
  LucideCircleCheckBig,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const DetailCourse = () => {
  document.title = "Detail Course";

  const { slug } = useParams();

  // ---------- State untuk data kursus ----------
  const [detailCourse, setDetailCourse] = useState({
    date: "",
    description: "",
    id: 0,
    image: "",
    material_path: "",
    materials: [],
    status: "",
    time: "",
    title: "",
    video: "",
    whatsapp_link: "",
    zoom_link: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- State untuk modal materi ----------
  const [modal, setModal] = useState({
    open: false,
    editMode: false,
    materialId: null,
    name: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // id yang akan dihapus

  // ---------- Helper: Format tanggal ----------
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "TBD";
    }
  };

  // ---------- Helper: Warna status ----------
  const getStatusColor = (status) => {
    const map = {
      active: "green",
      inactive: "gray",
      draft: "orange",
    };
    return map[status?.toLowerCase()] || "blue";
  };

  // ---------- Fetch data kursus ----------
  const fetchDetailCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");
      const response = await Api.get(`/api/admin/courses/${slug}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data;
      setDetailCourse({
        date: data.date,
        description: data.description,
        id: data.id,
        image: data.image,
        material_path: data.material_path,
        materials: data.materials || [],
        status: data.status,
        time: data.time,
        title: data.title,
        video: data.video,
        whatsapp_link: data.whatsapp_link,
        zoom_link: data.zoom_link,
      });
    } catch (err) {
      setError("Gagal memuat data kursus. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // ---------- CRUD: Buka modal tambah ----------
  const handleAddMaterial = () => {
    setModal({
      open: true,
      editMode: false,
      materialId: null,
      name: "",
    });
  };

  // ---------- CRUD: Buka modal edit ----------
  const handleEditMaterial = (material) => {
    setModal({
      open: true,
      editMode: true,
      materialId: material.id,
      name: material.learning_list || material.title || "",
    });
  };

  // ---------- CRUD: Hapus (munculkan konfirmasi) ----------
  const handleDeleteMaterial = (id) => {
    setDeleteConfirmId(id);
  };

  // ---------- CRUD: Konfirmasi hapus ----------
  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setSubmitting(true);
    try {
      const token = Cookies.get("token");
      await Api.delete(`/api/admin/course/material/${deleteConfirmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDetailCourse();
      toast.success("Materi berhasil dihapus");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus materi");
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  // ---------- CRUD: Submit (tambah / edit) ----------
  const submitMaterial = async (e) => {
    e.preventDefault();
    const name = modal.name.trim();
    if (!name) {
      toast.error("Nama materi tidak boleh kosong");
      return;
    }

    setSubmitting(true);
    try {
      const token = Cookies.get("token");
      const payload = {
        learning_list: name,
        course_id: detailCourse.id,
      };

      if (modal.editMode) {
        // Update
        await Api.put(`/api/admin/course/material/${modal.materialId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Materi berhasil diperbarui");
      } else {
        // Create
        await Api.post("/api/admin/course/material", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Materi berhasil ditambahkan");
      }

      // Refresh data dan tutup modal
      await fetchDetailCourse();
      setModal((prev) => ({ ...prev, open: false }));
    } catch (err) {
      console.error(err);
      toast.error(modal.editMode ? "Gagal memperbarui materi" : "Gagal menambahkan materi");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Render loading ----------
  if (loading) {
    return (
      <AdminLayout>
        <div className="m-5 text-center" style={{ padding: "80px 0" }}>
          <i className="fas fa-spinner fa-pulse fa-3x text-primary"></i>
          <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>Memuat data kursus...</p>
        </div>
      </AdminLayout>
    );
  }

  // ---------- Render error ----------
  if (error) {
    return (
      <AdminLayout>
        <div className="m-5 alert alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      </AdminLayout>
    );
  }

  // ---------- Render utama ----------
  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto p-5">
        {/* ---- Card Detail Kursus ---- */}
        <div className="card-modern">
          <div className="card-image">
            {detailCourse.image ? (
              <img src={detailCourse.image} alt="Visual kursus" />
            ) : (
              <div className="no-image">
                <Image />
                <span>No image</span>
              </div>
            )}
          </div>

          <div className="card-content">
            <span className="status-badge" style={{ color: getStatusColor(detailCourse.status) }}>
              <LucideCircleCheckBig style={{ color: getStatusColor(detailCourse.status) }} />
              {" " + (detailCourse.status || "Tidak diketahui")}
            </span>

            <h2 className="card-title">
              <BookOpen style={{ marginRight: "8px", color: "#007bff" }} />
              {detailCourse.title}
            </h2>

            <div className="datetime">
              <span className="item">
                <CalendarDaysIcon /> {formatDate(detailCourse.date)}
              </span>
              <span className="item">
                <ClockCheckIcon /> {detailCourse.time || "TBD"}
              </span>
            </div>

            <p className="card-description">
              <AlignLeft style={{ marginRight: "8px", color: "#6c757d" }} />
              {detailCourse.description}
            </p>

            <div className="card-links">
              {detailCourse.video ? (
                <a href={detailCourse.video} target="_blank" rel="noopener noreferrer" className="link-btn video">
                  <PlayCircle /> Recording
                </a>
              ) : (
                <span className="link-btn disabled">
                  <VideoOffIcon /> Tidak ada video
                </span>
              )}

              {detailCourse.material_path ? (
                <a href={detailCourse.material_path} target="_blank" rel="noopener noreferrer" className="link-btn material">
                  <FileIcon /> Materi
                </a>
              ) : (
                <span className="link-btn disabled">
                  <FileX2Icon /> Tidak ada materi
                </span>
              )}

              {detailCourse.whatsapp_link ? (
                <a href={detailCourse.whatsapp_link} target="_blank" rel="noopener noreferrer" className="link-btn whatsapp">
                  <Phone /> WhatsApp
                </a>
              ) : (
                <span className="link-btn disabled">
                  <LucidePhoneMissed /> Tidak ada WA
                </span>
              )}

              {detailCourse.zoom_link ? (
                <a href={detailCourse.zoom_link} target="_blank" rel="noopener noreferrer" className="link-btn zoom">
                  <Video /> Zoom
                </a>
              ) : (
                <span className="link-btn disabled">
                  <VideoOffIcon /> Tidak ada Zoom
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ---- Tabel Daftar Materi dengan CRUD ---- */}
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Daftar Materi</h3>
            <button
              onClick={handleAddMaterial}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F52BA] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3d8f] transition-colors"
            >
              <Plus className="size-4" />
              Tambah Materi
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Nama Materi</th>
                  <th className="px-6 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {detailCourse.materials && detailCourse.materials.length > 0 ? (
                  detailCourse.materials.map((material, index) => (
                    <tr key={material.id || index} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {material.learning_list || material.title || "Materi"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditMaterial(material)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(material.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-1">
                        <FileX2Icon className="size-6 text-gray-400" />
                        <span>Belum ada materi untuk kursus ini</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---- Modal Tambah/Edit Materi ---- */}
        {modal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {modal.editMode ? "Edit Materi" : "Tambah Materi Baru"}
                </h3>
                <button
                  onClick={() => setModal((prev) => ({ ...prev, open: false }))}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={submitMaterial}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Materi
                  </label>
                  <input
                    type="text"
                    value={modal.name}
                    onChange={(e) => setModal((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F52BA] focus:border-transparent outline-none"
                    placeholder="Masukkan nama materi"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModal((prev) => ({ ...prev, open: false }))}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#0F52BA] rounded-lg hover:bg-[#0a3d8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Menyimpan..." : modal.editMode ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---- Modal Konfirmasi Hapus ---- */}
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Konfirmasi Hapus</h3>
              <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus materi ini?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DetailCourse;