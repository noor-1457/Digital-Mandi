import { Navigate, Outlet, replace } from "react-router-dom";

function ProtectedRoutes({allowedRoles}) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.userRole)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoutes;
