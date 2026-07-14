import { useParams } from "react-router-dom";
import Api from "../../services/Api";
import AdminLayout from "./layouts";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { Circle } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { LucideCircleCheckBig } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Calendar } from "lucide-react";
import { CalendarDaysIcon } from "lucide-react";
import { ClockCheckIcon } from "lucide-react";
import { AlignLeft } from "lucide-react";
import { PlayCircle } from "lucide-react";
import { VideoOffIcon } from "lucide-react";
import { FileIcon } from "lucide-react";
import { FileX2Icon } from "lucide-react";
import { Phone } from "lucide-react";
import { LucidePhoneMissed } from "lucide-react";
import { Video } from "lucide-react";

// Import ikon dari Font Awesome (jika belum)
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircle, faCalendarAlt, faClock, faInfoCircle, faPlayCircle, faFilePdf, faWhatsapp, faVideo } from '@fortawesome/free-solid-svg-icons';
// Tapi karena Anda memakai class "fas fa-..." bisa langsung pakai.

const DetailCourse = () => {
  document.title = "Detail Course";

  const { slug } = useParams();
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
        materials: data.materials,
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
  }, [slug]);

  // Fungsi untuk menentukan warna status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "green";
      case "inactive":
        return "gray";
      case "draft":
        return "orange";
      default:
        return "blue";
    }
  };

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

  if (error) {
    return (
      <AdminLayout>
        <div className="m-5 alert alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="m-5">
        <div className="card-modern">
          {/* Gambar */}
          <div className="card-image">
            {detailCourse.image ? (
              <img src={detailCourse.image} alt="Visual kursus" />
            ) : (
              <div className="no-image">
                {/* <i className="fas fa-image"></i> */}
                <Image/>
                <span>No image</span>
              </div>
            )}
          </div>

          <div className="card-content">
            {/* Status dengan warna dinamis */}
            <span className="status-badge" style={{ color: getStatusColor(detailCourse.status) }}>
              <LucideCircleCheckBig style={{ color: getStatusColor(detailCourse.status) }}/>
              {" " + (detailCourse.status || "Tidak diketahui")}
            </span>

            {/* Judul */}
            <h2 className="card-title">
              <BookOpen style={{ marginRight: "8px", color: "#007bff" }}/>
              {detailCourse.title}
            </h2>

            {/* Tanggal & Waktu */}
            <div className="datetime">
              <span className="item">
                <CalendarDaysIcon/> {detailCourse.date}
              </span>
              <span className="item">
                <ClockCheckIcon/> {detailCourse.time}
              </span>
            </div>

            {/* Deskripsi dengan ikon */}
            <p className="card-description">
              <AlignLeft style={{ marginRight: "8px", color: "#6c757d" }}/>
              {detailCourse.description}
            </p>

            {/* Link - aksi */}
            <div className="card-links">
              {/* Video */}
              {detailCourse.video ? (
                <a
                  href={detailCourse.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn video"
                >
                  <PlayCircle/> Recording
                </a>
              ) : (
                <span className="link-btn disabled">
                  <VideoOffIcon/> Tidak ada video
                </span>
              )}

              {/* Materi */}
              {detailCourse.material_path ? (
                <a
                  href={detailCourse.material_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn material"
                >
                  <FileIcon/> Materi
                </a>
              ) : (
                <span className="link-btn disabled">
                  <FileX2Icon/> Tidak ada materi
                </span>
              )}

              {/* WhatsApp */}
              {detailCourse.whatsapp_link ? (
                <a
                  href={detailCourse.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn whatsapp"
                >
                  <Phone/> WhatsApp
                </a>
              ) : (
                <span className="link-btn disabled">
                  <LucidePhoneMissed/> Tidak ada WA
                </span>
              )}

              {/* Zoom */}
              {detailCourse.zoom_link ? (
                <a
                  href={detailCourse.zoom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn zoom"
                >
                  <Video/> Zoom
                </a>
              ) : (
                <span className="link-btn disabled">
                  <VideoOffIcon/> Tidak ada Zoom
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailCourse;