//import react router dom
import { Routes, Route } from "react-router-dom";
import AdminLogin from "../layouts/admin/login";
import PrivateRoutes from "./PrivateRoutes";
import AdminDasboard from "../layouts/admin/Dashboard";
import AdminCourse from "../layouts/admin/Courses";
import DetailCourse from "../layouts/admin/DetailCourse";
import AdminOrder from "../layouts/admin/Order";
import Homepage from "../layouts/customer/homepage";
import Register from "../layouts/customer/Register";
import Login from "../layouts/customer/Login";
import Forbidden from "../layouts/forbidden";
import DetailCourseCustomer from "../layouts/customer/detailCourse";

//======================================================
// view admin
//======================================================

//import view login


export default function RoutesIndex() {
  return (
    <Routes>
      {/* route "/login" */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <PrivateRoutes>
          <AdminDasboard />
        </PrivateRoutes>
      } />
      <Route path="/admin/courses" element={
        <PrivateRoutes>
          <AdminCourse />
        </PrivateRoutes>
      } />
      <Route path="/admin/orders" element={
        <PrivateRoutes>
          <AdminOrder />
        </PrivateRoutes>
      } />
      <Route path="/admin/courses/:slug" element={
        <PrivateRoutes>
          <DetailCourse />
        </PrivateRoutes>
      } />
      <Route path="/" element={<Homepage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forbidden" element={<Forbidden/>}/>
      <Route path="/course/detail/:slug" element={<DetailCourseCustomer/>}/>
    </Routes>
  );
}
