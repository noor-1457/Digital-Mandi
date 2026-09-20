import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import hero from "../assets/hero2.jpg";

const Hero = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-5">

      <div
        className="
          relative
          max-w-7xl
          mx-auto
          min-h-[350px]
          sm:min-h-[390px]
          lg:min-h-[430px]
          rounded-2xl
          overflow-hidden
          bg-[#f3f1df]
        "
      >

        {/* ================= BACKGROUND IMAGE ================= */}
        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-center
            lg:bg-right
          "
          style={{
            backgroundImage: `url(${hero})`,
          }}
        />

        {/* ================= LIGHT LEFT OVERLAY ================= */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#f3efc7]
            to-transparent
          "
        />

        {/* ================= CONTENT ================= */}
        <div
          className="
            relative
            z-10
            flex
            items-center
            min-h-[350px]
            sm:min-h-[390px]
            lg:min-h-[430px]
            px-7
            sm:px-10
            lg:px-11
          "
        >

          <div className="max-w-[500px]">

            {/* Small heading */}
            <div className="flex items-center gap-2 mb-3">

              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#006400]">
                FRESH
              </span>

              <span className="text-[#006400]">•</span>

              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#006400]">
                HEALTHY
              </span>

              <span className="text-[#006400]">•</span>

              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#006400]">
                LOCAL
              </span>

            </div>


            {/* Heading */}
            <h1
              className="
                text-4xl
                sm:text-5xl
                lg:text-[52px]
                font-bold
                leading-[1.08]
                tracking-tight
                text-[#024202]
              "
            >
              Fresh Groceries
              <br />
              at Your Doorstep
            </h1>


            {/* Description */}
            <p
              className="
                mt-5
                max-w-[470px]
                text-sm
                sm:text-base
                lg:text-[17px]
                leading-relaxed
                text-[#024202]
              "
            >
              Quality fruits, vegetables, grains and many more 
              <br className="hidden sm:block" />
              straight from trusted farmers to your home.
            </p>


            {/* Shop button */}
            <Link
              to="/products"
              className="
                group
                mt-7
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#006400]
                hover:bg-[#024202]
                px-7
                py-3.5
                text-white
                font-semibold
                text-sm
                sm:text-base
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
              "
            >
              Shop Now

              <ArrowRight
                size={19}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />

            </Link>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;