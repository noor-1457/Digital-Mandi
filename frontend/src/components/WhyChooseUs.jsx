import {
  ShieldCheck,
  Leaf,
  Truck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Fresh & Quality",
    description:
      "Fresh agricultural products sourced directly from trusted farmers.",
  },
  {
    icon: Users,
    title: "Trusted Farmers",
    description:
      "Connect with reliable local farmers and genuine agricultural sellers.",
  },
  {
    icon: Truck,
    title: "Easy Marketplace",
    description:
      "Find and explore agricultural products easily from one platform.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Reliable",
    description:
      "A simple and secure marketplace experience for buyers and farmers.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-14 sm:py-16">

      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">

          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#006400] uppercase">
            Why Digital Mandi
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#123f32]">
            Everything You Need in One Place
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#68736d]">
            Making agricultural shopping easier, simpler and more accessible
            for farmers and buyers.
          </p>

        </div>


        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group
                  rounded-2xl
                  border
                  border-[#e4e9df]
                  bg-[#f8faf5]
                  p-6
                  text-center
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-md
                "
              >

                <div
                  className="
                    mx-auto
                    w-14
                    h-14
                    rounded-full
                    bg-[#e3f0df]
                    flex
                    items-center
                    justify-center
                    text-[#006400]
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                >
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <h3 className="mt-4 text-base font-bold text-[#173f32]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[#68736d]">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;