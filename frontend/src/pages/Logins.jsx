// import React from 'react'

import {
  Mail,
  Lock,
  CheckCircle2,
  UserPlus,
  Leaf,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Logins() {

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FORM STATE =================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ================= PASSWORD VISIBILITY =================

  const [showPassword, setShowPassword] = useState(false);

  // ================= HANDLE INPUT CHANGE =================

  // This function updates the formData state whenever an input field changes.
  // prev is used to ensure that we are updating the state based on the previous state,
  // which is important for maintaining the other fields in formData.

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove old messages when user starts typing again
    setError("");
    setSuccess("");
  };

  // ================= FORM SUBMIT =================

  // e.preventDefault() prevents the default form submission behavior,
  // which would cause a page reload.
  // Instead, we handle the submission with our own logic.

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check if password is empty
    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // Data sent to backend
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        loginData,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      setSuccess("Login successful!");

      // Get logged-in user from backend response
      const user = response.data?.data?.user;

      // Clear form after successful login
      setFormData({
        email: "",
        password: "",
      });

      // Redirect user according to their role
      if (user?.userRole === "farmer") {
        navigate("/farmer-dashboard");
      } else if (user?.userRole === "buyer") {
        navigate("/buyer-dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#f8f7f2] pt-24 pb-12 px-4 sm:px-6">

        {/* PAGE CONTAINER */}

        <div className="max-w-2xl w-full mx-auto">

          <div className="flex justify-center items-center">

            {/* LOGIN CARD */}

            <div className="w-full max-w-2xl">

              <div className="bg-white border border-[#e3e7dc] rounded-3xl shadow-[0_20px_60px_-25px_rgba(38,51,38,0.25)] p-6 sm:p-8">

                {/* CARD HEADER */}

                <div className="text-center mb-7">

                  <div className="flex justify-center mb-4">

                    <div className="w-12 h-12 rounded-2xl bg-[#eef3e4] flex items-center justify-center text-[#607b37]">

                      <Leaf size={24} />

                    </div>

                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl text-[#293829]">
                    Log in to your account
                  </h2>

                  <p className="mt-2 text-sm text-[#7a8277]">
                    Welcome back to Digital Mandi.
                  </p>

                </div>

                {/* SUCCESS MESSAGE */}

                {success && (
                  <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                  </div>
                )}

                {/* ERROR MESSAGE */}

                {error && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* LOGIN FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* EMAIL */}

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa296]"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      autoComplete="email"
                      required
                      className="
                        w-full
                        rounded-xl
                        border border-[#dfe4d9]
                        bg-[#fafbf8]
                        pl-11 pr-4 py-3
                        text-sm text-[#293829]
                        placeholder:text-[#a1a89e]
                        outline-none
                        focus:border-[#8da94d]
                        focus:ring-2 focus:ring-[#a7c957]/20
                        transition-all
                      "
                    />

                  </div>

                  {/* PASSWORD */}

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa296]"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      autoComplete="current-password"
                      required
                      minLength={8}
                      className="
                        w-full
                        rounded-xl
                        border border-[#dfe4d9]
                        bg-[#fafbf8]
                        pl-11 pr-12 py-3
                        text-sm
                        outline-none
                        focus:border-[#8da94d]
                        focus:ring-2 focus:ring-[#a7c957]/20
                      "
                    />

                    {/* SHOW / HIDE PASSWORD */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa296] hover:text-[#536d2d]"
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                  {/* SUBMIT BUTTON */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      group
                      w-full
                      flex items-center justify-center gap-2
                      rounded-xl
                      bg-[#263326]
                      hover:bg-[#344534]
                      disabled:bg-[#7a8277]
                      disabled:cursor-not-allowed
                      text-white
                      font-semibold
                      py-3.5
                      mt-2
                      shadow-lg shadow-[#263326]/15
                      transition-all duration-300
                      hover:-translate-y-0.5
                    "
                  >

                    <UserPlus
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />

                    {loading ? "Logging In..." : "Log In"}

                    {!loading && (
                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    )}

                  </button>

                </form>

                {/* REGISTER LINK */}

                <p className="mt-6 text-center text-sm text-[#737b70]">

                  Don't have an account?

                  <Link
                    to="/register"
                    className="ml-1 font-semibold text-[#6f8f3f] hover:text-[#536d2d] transition-colors"
                  >
                    Register
                  </Link>

                </p>

                {/* TRUST FOOTER */}

                <div className="mt-5 pt-5 border-t border-[#edf0e9] flex items-center justify-center gap-5 text-[11px] text-[#9aa296]">

                  <span className="flex items-center gap-1">
                    <ShieldIcon />
                    Secure
                  </span>

                  <span className="flex items-center gap-1">
                    <Leaf size={13} />
                    Agriculture
                  </span>

                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Simple
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>
    </>
  );
}

// SMALL SHIELD ICON

const ShieldIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Logins;