import "./App.css";
import PublicLayout from "./layout/publicLayout.jsx";
import { Home } from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Logins from "./pages/Logins.jsx";


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
  </Routes>
  </BrowserRouter>
  </>
  );
}
 


export default App;
