import { useState } from 'react';
import Api from '../../services/Api';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Register = () => {
    document.title = "Sign Up - Saiful Trainer Consulting"
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);        // File object
  const [preview, setPreview] = useState(null);    // Image URL for preview
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      setPhoto(null);
      setPreview(null);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setMessage({ type: '', text: '' });

    // Prepare FormData
    const formData = new FormData();
    
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', password);
    formData.append('photo', photo);

    try {
      const response = await Api.post('/api/register', formData, {
        headers:{
            "Accept":"application/json",
            "Content-Type":"multipart/form-data"
        }
      });
      navigate('/login');
    } catch (error) {
    //   setMessage({ type: 'error', text: 'Gagal terhubung ke server.' });
    console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  if (Cookies.get("token")) {
        return <Navigate to="/" replace />;
    }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-5 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-amber-100 p-6 md:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-700 to-orange-700 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-extrabold text-gray-800">
                SAIFUL TRAINING <span className="text-amber-700">CONSULTING</span>
              </span>
            </div>
          </div>

          

          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span className="text-gray-400 text-xs">(bila ada gelar, tambahkan)</span>
              </label>
              <div className="relative">
                <i data-lucide="user" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Contoh: Dr. Ahmad Saiful, M.Pd."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                *Cantumkan gelar akademik jika ada (S.Pd., M.Pd., Ph.D., dll)
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <i data-lucide="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <i data-lucide="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Upload Foto dengan Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil (opsional)</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700">
                  Pilih Foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {preview && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-300 shadow-sm">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">*Format JPG, PNG, maks 2MB</p>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <i data-lucide="user-plus" className="w-5 h-5"></i>
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>

            {/* Pesan sukses/error */}
            {message.text && (
              <div
                className={`p-3 rounded-xl text-sm ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Sudah punya akun? <a href="login.html" className="text-amber-700 font-semibold hover:underline">Masuk di sini</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;