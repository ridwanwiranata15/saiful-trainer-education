import Api from "../services/Api";
import Cookies from "js-cookie";
class AuthController {
    static async login(email, password) {
        try {
            const response = await Api.post("/api/login", {
                email: email,
                password: password,
            });
            
            console.log('Login response:', response.data.user); // ✅ Cek response
            const userString = JSON.stringify(response.data.user);

            console.log(userString.length);

            Cookies.set("user", JSON.stringify({
                id: response.data.user.id,
                name: response.data.user.name,
                email:response.data.user.email,
                photo:response.data.user.photo
            }));

            console.log("Set:", Cookies.get("user"));
            
            // Cek apakah data ada
            if (response.data && response.data.token) {
                // Set cookies
                Cookies.set("token", response.data.token);
                Cookies.set("user", JSON.stringify(response.data.user));
                Cookies.set("permissions", JSON.stringify(response.data.permissions));                
                // ✅ Cek apakah cookie tersimpan
                console.log('Token cookie:', Cookies.get('token'));
                console.log('User cookie:', Cookies.get('user'));
                console.log('Permissions cookie:', Cookies.get('permissions'));
                
                return response;
            } else {
                console.error('Invalid response structure:', response);
            }
            
        } catch (error) {
            console.error('Login error:', error);
            return error;
        }
    }
}
export default AuthController