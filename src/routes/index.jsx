//import react router dom
import { Routes, Route } from "react-router-dom";
import AdminLogin from "../layouts/admin/login";
import PrivateRoutes from "./PrivateRoutes";
import AdminDasboard from "../layouts/admin/Dashboard";
import AdminCourse from "../layouts/admin/Courses";

//======================================================
// view admin
//======================================================

//import view login


export default function RoutesIndex() {
  return (
    <Routes>
      {/* route "/login" */}
      <Route path="/admin/login" element={<AdminLogin/>} />
      <Route path="/admin/dashboard" element={
        <PrivateRoutes>
            <AdminDasboard/>
        </PrivateRoutes>
      }/>
      <Route path="/admin/courses" element={
        <PrivateRoutes>
            <AdminCourse/>
        </PrivateRoutes>
      }/>
    </Routes>
  );
}
