import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  ArrowRight,
  Calendar,
  Clock,
  Award,
  Star,
  CheckCircle,
  Users,
  BookOpen,
  Briefcase,
  Shield,
} from "lucide-react";
import Api from "../../services/Api";

const Homepage = () => {
  document.title = "Saiful Training - pelatihan pendidik dan pengelola yayasan";
  const [user, setUser] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [missed, setMissed] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);

  const fetchUser = () => {
    try {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        setUser(JSON.parse(userCookie));
      }
    } catch {
      setUser(null);
    }
  };

  const fetchCourse = async () => {
    setLoadingCourse(true);
    try {
      const response = await Api.get("/api/courses", {
        headers: {
          Accept: "application/json",
        },
      });
      const course = response.data.data;
      setUpcoming(course.upcoming || []);
      setMissed(course.missed || []);
    } catch (error) {
      console.error("Gagal mengambil data course:", error);
      // Jika error, tetap kosongkan array
      setUpcoming([]);
      setMissed([]);
    } finally {
      setLoadingCourse(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCourse();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Komponen Skeleton Card
  const CourseSkeleton = () => (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 animate-pulse">
      <div className="h-44 bg-gray-200/80" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200/80 rounded w-3/4" />
        <div className="h-4 bg-gray-200/80 rounded w-full" />
        <div className="h-4 bg-gray-200/80 rounded w-5/6" />
        <div className="flex items-center gap-3 mt-4">
          <div className="h-4 bg-gray-200/80 rounded w-16" />
          <div className="w-px h-4 bg-gray-200/80" />
          <div className="h-4 bg-gray-200/80 rounded w-16" />
          <div className="w-px h-4 bg-gray-200/80" />
          <div className="h-4 bg-gray-200/80 rounded w-16" />
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="h-6 bg-gray-200/80 rounded w-24" />
          <div className="h-10 bg-gray-200/80 rounded-full w-20" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 font-sans antialiased">
      {/* Navbar – ultra glass */}
      <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-2xl border-b border-white/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-extrabold text-xl tracking-tight">S</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">
              SAIFUL{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                TRAINING
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {Cookies.get("token") ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100/50 hover:border-amber-200/70 group"
              >
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-200/70"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 text-amber-700 flex items-center justify-center text-xs font-bold">
                    {getInitials(user?.name)}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700 group-hover:text-amber-700 transition-colors">
                  Profile
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 hover:shadow-lg hover:shadow-amber-200/50 text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero – modern with floating shapes */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-100/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/60 rounded-full px-5 py-1.5 text-sm font-medium text-amber-700 shadow-sm mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600" />
              </span>
              Khusus Pendidik & Pengelola Lembaga
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto">
              Tingkatkan{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Kompetensi Guru
              </span>{" "}
              & <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Tata Kelola Yayasan
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-700 mt-6 max-w-2xl mx-auto leading-relaxed font-medium">
              Pelatihan berbasis riset & mentoring langsung untuk transformasi pendidikan
            </p>
            <p className="text-slate-600 text-lg md:text-xl mt-4 max-w-2xl mx-auto">
              Siapkan guru, kepala sekolah, dan ketua yayasan menghadapi tantangan digital & manajerial masa depan
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:shadow-xl hover:shadow-amber-200/50 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                Konsultasi Program
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 border border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 font-medium px-8 py-4 rounded-2xl hover:bg-amber-50/80 hover:border-amber-300 transition-all duration-300"
              >
                Lihat Kurikulum
              </a>
            </div>
          </div>
        </section>

        {/* Instruktur – glass card premium */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 md:py-20">
          <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 p-8 md:p-12 hover:shadow-amber-100/50 transition-shadow duration-500">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-200/60 to-orange-200/60 blur-2xl -z-10" />
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Saiful Anwar"
                  className="w-48 h-48 md:w-60 md:h-60 rounded-full object-cover ring-4 ring-amber-200/70 shadow-2xl"
                />
                <div className="absolute bottom-3 right-3 bg-emerald-500 rounded-full p-1.5 ring-2 ring-white shadow-lg" />
              </div>
              <div className="text-center md:text-left">
                <span className="inline-block bg-amber-100/80 text-amber-800 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 backdrop-blur-sm">
                  Lead Facilitator
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Saiful Anwar, M.Pd., Ph.D.</h2>
                <p className="text-amber-600 font-medium text-lg mt-1">Praktisi Pendidikan & Konsultan Manajemen Yayasan</p>
                <ul className="mt-5 space-y-2.5 text-slate-600">
                  <li className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    15+ tahun pengalaman melatih 200+ sekolah & yayasan
                  </li>
                  <li className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    Doktor Manajemen Pendidikan – Universitas Pendidikan Indonesia
                  </li>
                  <li className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    Fasilitator Nasional Kurikulum Merdeka & Akreditasi BAN-PDM
                  </li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-amber-50/80 text-amber-800 px-4 py-1.5 rounded-full text-sm border border-amber-200/50 backdrop-blur-sm flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Mentor Transformasi Digital
                  </span>
                  <span className="bg-amber-50/80 text-amber-800 px-4 py-1.5 rounded-full text-sm border border-amber-200/50 backdrop-blur-sm flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Ahli Tata Kelola Yayasan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses – grid dengan cards modern */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
          <div className="text-center mb-12">
            <span className="inline-block bg-amber-100/80 text-amber-800 text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full backdrop-blur-sm">
              Belajar Kapan Saja
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-4">
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Event & Pelatihan
              </span>{" "}
              Mendatang
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto mt-3 text-lg">
              Akses materi eksklusif untuk guru, kepala sekolah, dan pengelola yayasan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingCourse
              ? // Tampilkan skeleton loading
                Array.from({ length: 3 }).map((_, idx) => <CourseSkeleton key={idx} />)
              : // Tampilkan data sesungguhnya
                upcoming.map((course, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/60 hover:border-amber-200/50"
                  >
                    
                      <span className="drop-shadow-lg">
                        <img src={course.image} alt={course.title}/>
                      </span>
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                          ✨ {course.status}
                        </span>
                    
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed">{course.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> {course.modules} Modul
                        </span>
                        <span className="w-px h-4 bg-slate-200" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {course.hours} Jam
                        </span>
                        <span className="w-px h-4 bg-slate-200" />
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> Sertifikat
                        </span>
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-amber-700 font-bold text-lg">{course.price}</span>
                        <a
                          href="/detail"
                          className="text-sm bg-gradient-to-r from-amber-600 to-orange-500 hover:shadow-lg hover:shadow-amber-200/50 text-white px-5 py-2.5 rounded-full shadow transition-all duration-200 hover:scale-105"
                        >
                          Detail
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* Events – missed */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
          <div className="text-center mb-12">
            <span className="inline-block bg-amber-100/80 text-amber-800 text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full backdrop-blur-sm">
              Jadwal & Acara
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-4">Event & Pelatihan Terlewatkan</h2>
            <p className="text-slate-500 max-w-2xl mx-auto mt-3 text-lg">
              Ikuti workshop dan seminar eksklusif bersama para ahli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingCourse
              ? // Skeleton loading (sama)
                Array.from({ length: 3 }).map((_, idx) => <CourseSkeleton key={idx} />)
              : // Data missed
                missed.map((course, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/60 hover:border-amber-200/50"
                  >
                    
                      <span className="drop-shadow-lg">
                        <img src={course.image} alt={course.title} />
                      </span>
                      <div className="absolute top-4 right-4">
                        <span className="bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                          {course.status}
                        </span>
                      </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed">{course.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> {course.modules} Modul
                        </span>
                        <span className="w-px h-4 bg-slate-200" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {course.hours} Jam
                        </span>
                        <span className="w-px h-4 bg-slate-200" />
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> Sertifikat
                        </span>
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-amber-700 font-bold text-lg">{course.price}</span>
                        <a
                          href="/detail"
                          className="text-sm bg-gradient-to-r from-amber-600 to-orange-500 hover:shadow-lg hover:shadow-amber-200/50 text-white px-5 py-2.5 rounded-full shadow transition-all duration-200 hover:scale-105"
                        >
                          Detail
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
          <div className="text-center mb-12">
            <span className="inline-block bg-amber-100/80 text-amber-800 text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full backdrop-blur-sm">
              Testimonial
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-4">Apa Kata Mereka</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Taha Alamsyah, S.Pd.",
                role: "Guru SDIT Al-Furqan",
                text: "Materi penyusunan kurikulum operasional sangat aplikatif. Terima kasih SAIFUL TRAINING CONSULTING.",
                initials: "TA",
                bg: "bg-amber-200",
              },
              {
                name: "Muhammad Arief",
                role: "Ketua Yayasan Insan Cendekia",
                text: "Pelatihan manajemen yayasan sangat membantu. Mentor humble & kasusnya riil. Semoga berkah.",
                initials: "MA",
                bg: "bg-emerald-200",
              },
              {
                name: "Hafidz Dwi, M.Pd.",
                role: "Kepala SMK N 2 Surakarta",
                text: "Kepemimpinan transformasional membuka wawasan baru. Sukses selalu SAIFUL TRAINING CONSULTING.",
                initials: "HD",
                bg: "bg-blue-200",
              },
              {
                name: "Adrian Welli, S.Kom.",
                role: "Konsultan Pendidikan",
                text: "Pelatihan dana BOS dan akreditasi sangat berguna. Ilmunya aplikatif dan praktik langsung.",
                initials: "AW",
                bg: "bg-rose-200",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-white/50 backdrop-blur-xl rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50 hover:border-amber-200/50"
              >
                <div className="flex gap-0.5 text-amber-400 text-xl mb-3">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">“{t.text}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full ${t.bg} flex items-center justify-center font-bold text-slate-700`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 to-orange-700 shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
            <div className="relative px-8 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white">Wujudkan transformasi di lembaga Anda</h3>
                <p className="text-amber-100 text-lg mt-2 max-w-xl">
                  Dapatkan pendampingan eksklusif untuk guru, ketua yayasan, dan kepala sekolah.
                </p>
              </div>
              <a
                href="#"
                className="group bg-white text-amber-700 font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Jadwalkan Konsultasi
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 backdrop-blur-sm text-slate-300 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-800/50 pb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl bg-amber-600 flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold text-white">SAIFUL TRAINING</span>
              </div>
              <p className="text-slate-400 text-sm max-w-xs">
                Mitra terpercaya peningkatan kapasitas pendidik dan pengelola lembaga pendidikan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Lembaga</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Konsultan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog Edukasi
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Program</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pelatihan Guru
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pendampingan Yayasan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sertifikasi Kepsek
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Dukungan</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hubungi Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} SAIFUL TRAINING CONSULTING. Membangun ekosistem pendidikan yang unggul.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;