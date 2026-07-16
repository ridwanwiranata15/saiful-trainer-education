import { Home } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const Forbidden = () => {
    document.title = "Akses Ditolak - 403";
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center px-6 py-12">
            <div className="max-w-lg w-full text-center">
                {/* Ikon besar */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
                        <div className="relative bg-white/80 backdrop-blur-xl rounded-full p-8 shadow-2xl border border-red-200/50">
                            <ShieldAlert className="w-24 h-24 text-red-500" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <h1 className="text-6xl font-extrabold text-slate-800 tracking-tight">403</h1>
                <h2 className="text-2xl font-bold text-slate-700 mt-2">Akses Ditolak</h2>
                <p className="text-slate-600 mt-4 max-w-sm mx-auto">
                    Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini hanya untuk <span className="font-semibold text-amber-700">administrator</span>.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-amber-200/50 transition-all duration-300 hover:scale-105"
                    >
                        <Home className="w-5 h-5" />
                        Kembali ke Beranda
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 border border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 font-medium px-6 py-3 rounded-2xl hover:bg-amber-50/80 hover:border-amber-300 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Halaman Sebelumnya
                    </button>
                </div>

                <p className="mt-8 text-sm text-slate-400">
                    Jika Anda yakin ini adalah kesalahan, hubungi administrator.
                </p>
            </div>
        </div>
    );;
}

export default Forbidden;