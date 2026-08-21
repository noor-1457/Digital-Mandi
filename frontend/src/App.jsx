import "./App.css";
import PublicLayout from "./layout/publicLayout.jsx";
import { Home } from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Logins from "./pages/Logins.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import Profile from "./pages/Profile";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Logins />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoutes allowedRoles={["buyer"]} />}>
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            </Route>

            <Route element={<ProtectedRoutes allowedRoles={["farmer"]} />}>
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            </Route>
          <Route
            element={
              <ProtectedRoutes allowedRoles={["buyer", "farmer", "admin"]} />
            }
          >
            <Route path="/profile" element={<Profile />} />
          </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
