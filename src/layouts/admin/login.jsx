import { ArrowRight, Lock, GraduationCap, Star, Eye, Mail, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import AuthController from "../../controllers/AuthController";
import { Quote } from "lucide-react";

const AdminLogin = () => {
    document.title = "Sign up - saiful training"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isFocused, setIsFocused] = useState({ email: false, password: false });

    // Check if already logged in
    if (Cookies.get("token")) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Reset error
        setError("");
        
        // Validate inputs
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await AuthController.login(email, password);
            
            // Check if login was successful
            if (response && response.token) {
                // Redirect will happen automatically due to the check above
                window.location.href = "/admin/dashboard";
            } else {
                setError(response?.message || "Login failed. Please try again.");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "An error occurred during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="font-sans bg-white min-h-screen text-gray-900 antialiased">
            <div className="min-h-screen flex w-full">
                {/* Left Panel - Login Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 bg-white relative z-10">
                    <div className="max-w-md w-full mx-auto">
                        {/* Logo & Title */}
                        <div className="mb-10">
                            <div className="w-14 h-14 bg-[#0F52BA]/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-[#0F52BA]/20">
                                <GraduationCap className="w-7 h-7 text-[#0F52BA]" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                                Saiful Trainer
                            </h1>
                            <p className="text-gray-500 text-lg">Management</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="inputEmail" className="text-sm font-semibold text-gray-900 block">
                                    Email Address
                                </label>
                                <div className={`relative group transition-all duration-200 ${
                                    isFocused.email ? 'ring-2 ring-[#0F52BA]/20' : ''
                                }`}>
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                        isFocused.email ? 'text-[#0F52BA]' : 'text-gray-500'
                                    }`} />
                                    <input
                                        type="email"
                                        id="inputEmail"
                                        required
                                        disabled={isLoading}
                                        placeholder="admin@example.com"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0F52BA] outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setIsFocused({ ...isFocused, email: true })}
                                        onBlur={() => setIsFocused({ ...isFocused, email: false })}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="inputPassword" className="text-sm font-semibold text-gray-900 block">
                                        Password
                                    </label>
                                    <a 
                                        href="#" 
                                        className="text-sm text-[#0F52BA] font-medium hover:text-[#0B3D8C] transition-colors"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className={`relative group transition-all duration-200 ${
                                    isFocused.password ? 'ring-2 ring-[#0F52BA]/20' : ''
                                }`}>
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                        isFocused.password ? 'text-[#0F52BA]' : 'text-gray-500'
                                    }`} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="inputPassword"
                                        required
                                        disabled={isLoading}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0F52BA] outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setIsFocused({ ...isFocused, password: true })}
                                        onBlur={() => setIsFocused({ ...isFocused, password: false })}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        disabled={isLoading}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 mt-2 bg-[#0F52BA] text-white rounded-xl font-bold text-lg hover:bg-[#0B3D8C] hover:shadow-lg hover:shadow-[#0F52BA]/25 transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500">
                                Need access?{' '}
                                <a href="#" className="text-[#0F52BA] font-medium hover:underline">
                                    Contact System Administrator
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Hero/Testimonial */}
                <div className="hidden lg:block lg:w-1/2 relative bg-gray-900 overflow-hidden">
                    {/* Background Image */}
                    <img
                        src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2025&auto=format&fit=crop"
                        alt="Luxury Car Interior"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Testimonial Card */}
                    <div className="absolute bottom-16 left-12 right-12 xl:right-auto xl:w-[420px] bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 transform transition-transform duration-500 hover:-translate-y-2">
                        {/* Star Ratings */}
                        <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-gray-900 font-medium text-lg leading-relaxed mb-6">
                            "The Saiful Trainer Management system has completely revolutionized 
                            how we onboard and track our sales team. It's clean, fast, and 
                            incredibly intuitive."
                        </p>

                        {/* Reviewer Info */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" 
                                    alt="Reviewer" 
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" 
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">David Reynolds</p>
                                <p className="text-sm text-gray-500">Regional Director, AutoDeals</p>
                            </div>
                        </div>

                        {/* Quote Icon */}
                        <Quote className="absolute top-6 right-6 w-12 h-12 text-gray-200/50 rotate-180" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;