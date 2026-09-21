import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BestSellers from "../components/BestSellers";
import WhyChooseUs from "../components/WhyChooseUs";
import { Navbar } from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";   // ✅ Default import

export const Home = () => {
  return (
    <div className="bg-[#f8f7f2] text-[#263326] pt-[138px]">
      <Navbar />

     <Hero />
     <Categories />
      <BestSellers />
      <WhyChooseUs />
    
<Footer />
    </div>
  );
};