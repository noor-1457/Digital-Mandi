import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BestSellers from "../components/BestSellers";

export const Home = () => {
  return (
    <main className="bg-[#f8f7f2] text-[#263326] pt-[138px]">

     <Hero />
     <Categories />
      <BestSellers />

    </main>
  );
};