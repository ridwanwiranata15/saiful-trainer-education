import Api from "../services/Api";
import Cookies from "js-cookie";
class AuthController {
    static async login(email, password) {
        try {
            const response = await Api.post("/api/login", {
                email: email,
                password: password,
            });
           
            const responsePermissions = response.data.permissions
            const permissionsData = {
                "orders.create": true,
                "orders.edit":true,
                "orders.index":true
            }
            const isCustomer = Object.keys(responsePermissions).every(
                key => permissionsData.hasOwnProperty(key) &&
                permissionsData[key] === responsePermissions[key]
            );
            isCustomer ? 
            console.log("Pengguna adalah customer (tidak punya izin tambahan)")
            
            :  
            Cookies.set("user", JSON.stringify({
                id: response.data.user.id,
                name: response.data.user.name,
                email:response.data.user.email,
                photo:response.data.user.photo
            }));
            Cookies.set("token", response.data.token);
            Cookies.set("user", JSON.stringify(response.data.user));
            Cookies.set("permissions", JSON.stringify(response.data.permissions)); 
            return response            
            // console.log('Login response:', response.data.user); // ✅ Cek response
            // const userString = JSON.stringify(response.data.user);

            // console.log(userString.length);

            // Cookies.set("user", JSON.stringify({
            //     id: response.data.user.id,
            //     name: response.data.user.name,
            //     email:response.data.user.email,
            //     photo:response.data.user.photo
            // }));

            // console.log("Set:", Cookies.get("user"));
            
            // Cek apakah data ada
            // if (response.data && response.data.token) {
            //     // Set cookies
            //     Cookies.set("token", response.data.token);
            //     Cookies.set("user", JSON.stringify(response.data.user));
            //     Cookies.set("permissions", JSON.stringify(response.data.permissions));                
            //     // ✅ Cek apakah cookie tersimpan
            //     // console.log('Token cookie:', Cookies.get('token'));
            //     // console.log('User cookie:', Cookies.get('user'));                
            //     return response;
            // } else {
            //     console.error('Invalid response structure:', response);
            // }
            
        } catch (error) {
            console.error('Login error:', error.response);
            return error;
        }
    }
}
export default AuthController