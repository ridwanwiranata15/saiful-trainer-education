import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { useEffect } from "react";

const Header = () => {
    const [user, setUser] = useState(null);
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
    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };
    useEffect(() => {
        fetchUser();
    })
    return (<>
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
    </>);
}

export default Header;