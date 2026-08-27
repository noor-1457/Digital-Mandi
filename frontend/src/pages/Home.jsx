import {
  ArrowRight,
  CheckCircle2,
  Handshake,
  Leaf,
  MapPin,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import hero from "../assets/hero.jpg";


const steps = [
  {
    number: "01",
    title: "Create Your Account.",
    description:
      "Register with your basic information and choose whether you are a Farmer or Buyer.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Complete Your Profile",
    description:
      "Add your personal details and, if you are a farmer, your farm information.",
    icon: Users,
  },
  {
    number: "03",
    title: "Access Your Dashboard",
    description:
      "Get a personalized dashboard based on your selected user role.",
    icon: ShieldCheck,
  },
];


const benefits = [
  {
    title: "Direct Connection",
    description:
      "A platform designed to bring farmers and buyers closer together.",
    icon: Handshake,
  },
  {
    title: "Transparent Information",
    description:
      "Keep important user and agricultural information organized in one place.",
    icon: CheckCircle2,
  },
  {
    title: "Local Agriculture",
    description:
      "Create a digital space focused on farmers, buyers, and agricultural communities.",
    icon: MapPin,
  },
];


export const Home = () => {
  return (
    <main className="bg-[#f8f7f2] text-[#263326]">

          {/* HERO SECTION */}
      <section className="relative min-h-[620px] h-[76vh] max-h-[720px] flex items-center overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${hero})`,
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#172016]/75" />

        {/* Decorative background glow */}
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-[#fdd835]/10 blur-3xl" />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">

          <div className="max-w-3xl">

            {/* Main heading */}
            <h1 className="font-display mt-6 text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] text-white">

              <span className="italic text-[#fdd835]">
                Smart Agriculture.
              </span>

              <br />

              Better Connections.

            </h1>

            {/* Hero description */}
            <p className="mt-6 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed">
              Digital Mandi provides a simple platform for farmers and buyers
              to create accounts, manage their profiles, and connect through
              a digital agricultural marketplace.
            </p>

            {/* Hero buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">

              {/* Register */}
              <a
                href="/register"
                className="cursor-pointer group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#fdd835] to-[#006400] text-white font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                Create Account

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </a>

              {/* Login */}
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/25 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-medium transition-all duration-300"
              >
                Login
              </a>

            </div>

          </div>
        </div>

        {/* Bottom transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f8f7f2] to-transparent" />

      </section>


          {/* HOW DIGITAL MANDI WORKS */}

      <section className="py-20 lg:py-24 bg-[#f8f7f2]">

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Section heading */}
          <div className="max-w-2xl mb-14">

            <div className="flex items-center gap-3 mb-4">

              <span className="w-10 h-px bg-[#fdd835]" />

              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#006400]">
                Getting Started
              </span>

            </div>

            <h2 className="font-display text-4xl sm:text-5xl leading-tight text-[#006400]">

              How Digital Mandi
              <span className="italic text-[#fdd835]">
                {" "}works.
              </span>

            </h2>

            <p className="mt-4 text-black leading-relaxed">
              Getting started is simple. Create an account, complete your
              profile, and access a dashboard designed around your role.
            </p>

          </div>


          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-6">

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative bg-white border border-[#fdd835] rounded-2xl p-7 hover:border-[#ffeb3b] hover:-translate-y-1 transition-all duration-300"
                >

                  {/* Step number */}
                  <div className="flex items-center justify-between">

                    <span className="text-sm font-semibold text-[#006400]">
                      {step.number}
                    </span>

                    <div className="w-11 h-11 rounded-xl bg-[#ffeb3b] flex items-center justify-center text-[#006400]">
                      <Icon size={21} />
                    </div>

                  </div>

                  {/* Step title */}
                  <h3 className="mt-7 text-xl font-semibold text-[#006400]">
                    {step.title}
                  </h3>

                  {/* Step description */}
                  <p className="mt-3 text-sm text-black leading-relaxed">
                    {step.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>



    </main>
  );
};