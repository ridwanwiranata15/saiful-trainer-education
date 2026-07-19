// import { useState } from 'react';
// import Api from '../../services/Api';
// import { Link, Navigate, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';

// const Login = () => {
//     document.title = "Sign In - Saiful Trainer Consulting"
//     // State for form fields
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [photo, setPhoto] = useState(null);        // File object
//     const [preview, setPreview] = useState(null);    // Image URL for preview
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState({ type: '', text: '' });
//     const navigate = useNavigate();

//     // Handle file selection and preview
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setPhoto(file);
//             const previewUrl = URL.createObjectURL(file);
//             setPreview(previewUrl);
//         } else {
//             setPhoto(null);
//             setPreview(null);
//         }
//     };

//     // Handle registration
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         // setMessage({ type: '', text: '' });

//         // Prepare FormData
//         const formData = new FormData();


//         formData.append('email', email);
//         formData.append('password', password);

//         try {
//             const response = await Api.post('/api/login', formData, {
//                 headers: {
//                     "Accept": "application/json",
//                     "Content-Type": "multipart/form-data"
//                 }
//             });
//             Cookies.set("token", response.data.token);

//             //set user to cookies
//             Cookies.set("user", JSON.stringify(response.data.user));

//             //set permissions to cookies
//             Cookies.set("permissions", JSON.stringify(response.data.permissions));
//             navigate('/')
//         } catch (error) {
//             //   setMessage({ type: 'error', text: 'Gagal terhubung ke server.' });
//             console.log(error.response);
//         } finally {
//             setLoading(false);
//         }
//     };
//     if (Cookies.get("token")) {
//         return <Navigate to="/" replace />;
//     }

//     return (
//         <>
//             <div className="min-h-screen flex items-center justify-center px-5 py-12">
//                 <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-amber-100 p-6 md:p-8">
//                     {/* Logo */}
//                     <div className="flex justify-center mb-6">
//                         <div className="flex items-center gap-2">
//                             <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-700 to-orange-700 flex items-center justify-center shadow-md">
//                                 <span className="text-white font-bold text-xl">S</span>
//                             </div>
//                             <span className="text-xl font-extrabold text-gray-800">
//                                 SAIFUL TRAINING <span className="text-amber-700">CONSULTING</span>
//                             </span>
//                         </div>
//                     </div>



//                     <form className="mt-6 space-y-4" onSubmit={handleLogin}>
//                         {/* Nama Lengkap */}


//                         {/* Email */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                             <div className="relative">
//                                 <i data-lucide="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
//                                 <input
//                                     type="email"
//                                     required
//                                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
//                                     placeholder="nama@email.com"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                 />
//                             </div>
//                         </div>

//                         {/* Password */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                             <div className="relative">
//                                 <i data-lucide="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
//                                 <input
//                                     type="password"
//                                     required
//                                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
//                                     placeholder="Minimal 6 karakter"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                 />
//                             </div>
//                         </div>

//                         {/* Upload Foto dengan Preview */}


//                         {/* Tombol Submit */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
//                         >
//                             <i data-lucide="user-plus" className="w-5 h-5"></i>
//                             {loading ? 'Memuat...' : 'Masuk Sekarang'}
//                         </button>

//                         {/* Pesan sukses/error */}
//                         {message.text && (
//                             <div
//                                 className={`p-3 rounded-xl text-sm ${message.type === 'success'
//                                         ? 'bg-green-100 text-green-700'
//                                         : 'bg-red-100 text-red-700'
//                                     }`}
//                             >
//                                 {message.text}
//                             </div>
//                         )}
//                     </form>

//                     <p className="text-center text-gray-500 text-sm mt-6">
//                         Belum punya akun? <Link to={"/register"} className="text-amber-700 font-semibold hover:underline">Daftar di sini</Link>
//                     </p>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Login;










import { useState } from 'react';
import Api from '../../services/Api';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
    document.title = "Sign In - Saiful Trainer Consulting"
    // State for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [photo, setPhoto] = useState(null);        // File object
    const [preview, setPreview] = useState(null);    // Image URL for preview
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // State untuk show/hide password
    const [showPassword, setShowPassword] = useState(false);

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
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        // setMessage({ type: '', text: '' });

        // Prepare FormData
        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        try {
            const response = await Api.post('/api/login', formData, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "multipart/form-data"
                }
            });
            Cookies.set("token", response.data.token);

            //set user to cookies
            Cookies.set("user", JSON.stringify(response.data.user));

            //set permissions to cookies
            Cookies.set("permissions", JSON.stringify(response.data.permissions));
            navigate('/')
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

                    <form className="mt-6 space-y-4" onSubmit={handleLogin}>
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

                        {/* Password dengan tombol show/hide */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <i data-lucide="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                    placeholder="Minimal 6 karakter"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {/* Tombol toggle show/hide password */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        // Ikon "mata tertutup" (eye-off)
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        // Ikon "mata terbuka" (eye)
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Upload Foto dengan Preview */}

                        {/* Tombol Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            <i data-lucide="user-plus" className="w-5 h-5"></i>
                            {loading ? 'Memuat...' : 'Masuk Sekarang'}
                        </button>

                        {/* Pesan sukses/error */}
                        {message.text && (
                            <div
                                className={`p-3 rounded-xl text-sm ${message.type === 'success'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Belum punya akun? <Link to={"/register"} className="text-amber-700 font-semibold hover:underline">Daftar di sini</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;