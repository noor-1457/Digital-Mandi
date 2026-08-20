import "./App.css";
import PublicLayout from "./layout/publicLayout.jsx";
import { Home } from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Logins from "./pages/Logins.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";


function App() {
 return (
  <>
  
  <BrowserRouter>
  <Routes>
       <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Logins />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
       </Route>
  </Routes>
  </BrowserRouter>
  </>
  );
}
 


export default App;
