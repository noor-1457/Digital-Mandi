import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  console.log("Protected Route:");
  console.log("Token:", token);
  console.log("User:", user);
  console.log("User Role:", user?.userRole);
  console.log("Allowed Roles:", allowedRoles);

  if (!token) {
    console.log("NO TOKEN → LOGIN");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.userRole)) {
    console.log("ROLE NOT ALLOWED → HOME");
    return <Navigate to="/" replace />;
  }

  console.log("ACCESS GRANTED");

  return <Outlet />;
}

export default ProtectedRoutes;