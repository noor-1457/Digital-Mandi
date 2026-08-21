import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
// import { Footer } from "../components/Footer.jsx";

export default function ProtectedLayout() {
  return (
    <>
      <div>
        <Sidebar />

        <main>
          <Outlet />
        </main>
      </div>
      {/* <Footer /> */}
    </>
  );
}