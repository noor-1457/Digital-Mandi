import "./App.css";
import PublicLayout from "./layout/publicLayout.jsx";
import { Home } from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
 return (
  <>
  
  <BrowserRouter>
  <Routes>
       <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            {/* <Route path="*" element={<Home />} /> */}
       </Route>
  </Routes>
  </BrowserRouter>
  </>
  );
}
 


export default App;
