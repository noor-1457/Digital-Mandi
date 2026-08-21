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
    title: "Create Your Account",
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


          {/* CHOOSE YOUR ROLE */}

      <section className="py-20 lg:py-24 bg-[#eef2e7]">

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Section heading */}
          <div className="text-center max-w-2xl mx-auto mb-12">

            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#fdd835] flex items-center justify-center text-[#006400] border border-[#ffeb3b]">
                <Users size={23} />
              </div>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl text-[#006400]">
              Choose your
              <span className="italic text-[#fdd835]">
                {" "}role.
              </span>
            </h2>

            <p className="mt-4 text-black leading-relaxed">
              Digital Mandi provides separate experiences for the two primary
              users of the platform.
            </p>

          </div>


          {/* Role cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

            {/* Farmer card */}
            <div className="group bg-[#006400] rounded-3xl p-8 lg:p-10 text-white overflow-hidden relative">

              {/* Decorative circle */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#ffeb3b]" />

              <div className="relative z-10">

                <div className="w-12 h-12 rounded-xl bg-[#a7c957]/15 flex items-center justify-center text-[#fdd835]">
                  <Leaf size={24} />
                </div>

                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-[#fdd835] font-semibold">
                  For Farmers
                </p>

                <h3 className="font-display text-3xl sm:text-4xl mt-2">
                  Grow your digital presence.
                </h3>

                <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-md">
                  Create your farmer profile and manage information about
                  your farm, location, and primary crop.
                </p>

                <a
                  href="/register?role=farmer"
                  className="inline-flex items-center gap-2 mt-7 text-sm font-semibold text-[#fdd835] cursor-pointer"
                >
                  Register as Farmer

                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </a>

              </div>

            </div>


            {/* Buyer card */}
            <div className="group bg-white rounded-3xl p-8 lg:p-10 border border-[#dde4d3] overflow-hidden relative">

              {/* Decorative circle */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#006400]" />

              <div className="relative z-10">

                <div className="w-12 h-12 rounded-xl bg-[#006400]/10 flex items-center justify-center text-[#fdd835]">
                  <Users size={24} />
                </div>

                <p className="mt-7 text-xs uppercase tracking-[0.2em] text-[#fdd835] font-semibold">
                  For Buyers
                </p>

                <h3 className="font-display text-3xl sm:text-4xl mt-2 text-[#293829]">
                  Build your marketplace profile.
                </h3>

                <p className="mt-4 text-sm text-[#737b70] leading-relaxed max-w-md">
                  Create your buyer account and maintain your personal
                  information through your profile.
                </p>

                <a
                  href="/register?role=buyer"
                  className="inline-flex items-center gap-2 mt-7 text-sm font-semibold text-[#fdd835] cursor-pointer"
                >
                  Register as Buyer

                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>


          {/* WHY DIGITAL MANDI */}

      <section className="py-20 lg:py-24 bg-[#f8f7f2]">

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Heading */}
          <div className="max-w-2xl mb-12">

            <div className="flex items-center gap-3 mb-4">

              <span className="w-10 h-px bg-[#fdd835]" />

              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#006400]">
                The Platform
              </span>

            </div>

            <h2 className="font-display text-4xl sm:text-5xl text-[#006400]">
              Designed around
              <span className="italic text-[#fdd835]">
                {" "}people.
              </span>
            </h2>

          </div>


          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6">

            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="flex gap-5 p-6 rounded-2xl border border-[#e4e7de] bg-white"
                >

                  <div className="shrink-0 w-11 h-11 rounded-xl bg-[#fdd835] flex items-center justify-center text-[#006400]">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#006400]">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm text-black leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>


          {/* FINAL CALL TO ACTION */}

      <section className="px-6 pb-20 lg:pb-24 bg-[#f8f7f2]">

        <div className="max-w-7xl mx-auto">

          <div className="relative overflow-hidden rounded-3xl bg-[#006400] px-7 py-12 md:px-12 text-center">

            {/* Decorative elements */}
            <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-[#ffeb3b]/50 blur-3xl" />

            <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-[#ffeb3b]/50 blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto">

              <p className="text-xs uppercase tracking-[0.2em] text-white font-semibold">
                Join Digital Mandi
              </p>

              <h2 className="font-display text-4xl sm:text-5xl text-white mt-4">
                Ready to get
                <span className="italic text-[#fdd835]">
                  {" "}started?
                </span>
              </h2>

              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                Create your account and become part of a smarter agricultural
                marketplace.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">

                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#006400] font-semibold transition-all duration-300"
                >
                  Create Account
                  <ArrowRight size={18} />
                </a>

                <a
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-white text-white hover:bg-white/10 font-medium transition-all duration-300"
                >
                  Login
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};