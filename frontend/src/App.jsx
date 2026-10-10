// import "./App.css";
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
import AddProduct from "./pages/addProduct.jsx";
import MyProducts from "./pages/MyProducts.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import { CartItems } from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import FarmerOrders from "./pages/FarmerOrders.jsx";
import BuyerOrders from "./pages/BuyerOrders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Logins />} />
            <Route path="/allProducts" element={<AllProducts />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
          </Route>

          {/* ================= PROTECTED ROUTES ================= */}
          <Route element={<ProtectedLayout />}>
            {/* ---- Admin ---- */}
            <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

            {/* ---- Buyer ---- */}
            <Route element={<ProtectedRoutes allowedRoles={["buyer"]} />}>
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<CartItems />} />
              <Route
                path="/order-success/:orderId"
                element={<OrderSuccess />}
              />
              <Route path="/buyer-orders" element={<BuyerOrders />} />
            </Route>

            {/* ---- Farmer ---- */}
            <Route element={<ProtectedRoutes allowedRoles={["farmer"]} />}>
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/addProduct" element={<AddProduct />} />
              <Route path="/myProducts" element={<MyProducts />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<AddProduct />} />
              <Route path="/farmer-orders" element={<FarmerOrders />} />
            </Route>

            {/* ---- Buyer + Farmer (Common) ---- */}
            <Route
              element={<ProtectedRoutes allowedRoles={["buyer", "farmer"]} />}
            >
              <Route path="/order/:orderId" element={<OrderDetail />} />
            </Route>

            {/* ---- Buyer + Farmer + Admin (Common) ---- */}
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