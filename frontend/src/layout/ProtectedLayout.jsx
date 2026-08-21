import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
// import { Footer } from "../components/Footer.jsx";

export default function ProtectedLayout() {
  return (
    <>
      <div className="bg-slate-200 dark:bg-slate-900">
        <Sidebar />

        <main>
          <Outlet />
        </main>
      </div>
      {/* <Footer /> */}
    </>
  );
}