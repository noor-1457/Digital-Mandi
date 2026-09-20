import { Link } from "react-router-dom";

import grains from "../assets/cereals.jpg";
import pulses from "../assets/pulses.jpg";
import fruits from "../assets/fruits.jpg";
import veggies from "../assets/veggies.jpg";
import spices from "../assets/spices.jpg";

const categories = [
  {
    name: "Grains",
    image: grains,
    path: "/products?category=grains",
  },
  {
    name: "Pulses",
    image: pulses,
    path: "/products?category=pulses",
  },
  {
    name: "Fruits",
    image: fruits,
    path: "/products?category=fruits",
  },
  {
    name: "Veggies",
    image: veggies,
    path: "/products?category=veggies",
  },
  {
    name: "Spices",
    image: spices,
    path: "/products?category=spices",
  },
];

const Categories = () => {
  return (
    <section className="bg-[#f8f7f2] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADING ================= */}
        <div className="mb-6 sm:mb-8">

          <div className="flex items-center gap-3">

            {/* small box */}
                     <div className="bg-[#006400] h-5 w-15 rounded"></div>


            <h2 className="text-2xl sm:text-3xl font-bold text-[#006400]">
              Categories
            </h2>

          </div>
        </div>


        {/* ================= CATEGORY LIST ================= */}
        <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-5
          gap-5
          sm:gap-6
        ">

          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="group text-center"
            >

              {/* Image Circle */}
              <div
                className="
                  mx-auto
                  w-[145px]
                  h-[145px]
                  sm:w-[155px]
                  sm:h-[155px]
                  lg:w-[175px]
                  lg:h-[175px]
                  rounded-full
                  bg-[#edf1df]
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                  transition-all
                  duration-300
                  group-hover:scale-[1.04]
                  group-hover:shadow-md
                "
              >

                <img
                  src={category.image}
                  alt={category.name}
                  className="
                    w-full
                    h-full
                    object-cover
                    rounded-full
                    p-1
                    sm:
                    p-2
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

              </div>


              {/* Category Name */}
              <h3
                className="
                  mt-3
                  text-sm
                  sm:text-base
                  font-semibold
                  text-[#006400]
                  group-hover:text-[#024202]
                  transition-colors
                "
              >
                {category.name}
              </h3>

            </Link>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Categories;