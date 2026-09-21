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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        loginData,
        {
          withCredentials: true,
        },
      );

      // console.log(response.data);
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setSuccess("Login successful!");

      const user = response.data.user;

      setFormData({
        email: "",
        password: "",
      });

      // console.log("Navigating to:", response.data.dashboardUrl);
      navigate(response.data.dashboardUrl);
    } catch (error) {
      // console.log(error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== PAGE BACKGROUND =====
          Soft green-tinted background that blends well with the brand green.
          It's lighter and fresher than the previous beige, giving a natural/organic feel. */}
      <main className="min-h-screen bg-gradient-to-br from-[#f0f7ed] via-[#f7fbf5] to-[#eaf3e6] pt-6 pb-10 px-4 sm:px-6">
        <div className="max-w-md w-full mx-auto">
          {/* LOGIN CARD */}
          <div
            className="
              bg-white
              rounded-2xl
              p-6 sm:p-7
              border border-[#41802c]
              shadow-[0_10px_40px_-12px_rgba(0,100,0,0.50)]
            "
          >
            {/* CARD HEADER */}
            <div className="text-center mb-5">
              <div className="flex justify-center mb-3">
                {/* ================= LOGO ================= */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <Leaf
                      size={36}
                      strokeWidth={1.7}
                      className="text-[#006400]"
                    />

                    <Leaf
                      size={17}
                      strokeWidth={2}
                      className="absolute bottom-0.5 right-0 text-[#5b9b58]"
                    />
                  </div>

                  <div className="leading-none text-left">
                    <h1 className="text-[22px] font-bold text-[#006400] tracking-tight">
                      Digital Mandi
                    </h1>

                    <p className="text-[9px] text-[#6b756e] tracking-[0.12em] mt-1">
                      Fresh Produce&nbsp;&nbsp;•&nbsp;&nbsp;Better Living
                    </p>
                  </div>
                </Link>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl text-black">
                Log in
              </h2>

              <p className="mt-1 text-xs text-[#7a8277]">
                Welcome back to Digital Mandi.
              </p>
            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3.5 py-2.5 text-xs text-green-700">
                {success}
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-600">
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* EMAIL */}
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
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
                    rounded-lg
                    border border-[#dfe4d9]
                    bg-[#fafbf8]
                    pl-10 pr-4 py-2.5
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
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
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
                    rounded-lg
                    border border-[#dfe4d9]
                    bg-[#fafbf8]
                    pl-10 pr-11 py-2.5
                    text-sm
                    outline-none
                    focus:border-[#8da94d]
                    focus:ring-2 focus:ring-[#a7c957]/20
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute cursor-pointer right-3.5 top-1/2 -translate-y-1/2 text-[#9aa296] hover:text-[#536d2d]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  rounded-lg
                  bg-[#006400]
                  hover:bg-[#344534]
                  disabled:bg-[#7a8277]
                  disabled:cursor-not-allowed
                  text-white
                  font-semibold
                  text-sm
                  py-3
                  mt-1
                  shadow-md shadow-[#006400]/20
                  transition-all duration-300
                  hover:-translate-y-0.5
                  cursor-pointer
                "
              >
                <UserPlus
                  size={16}
                  className="group-hover:scale-110 transition-transform"
                />

                {loading ? "Logging In..." : "Log In"}

                {!loading && (
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>
            </form>

            {/* REGISTER LINK */}
            <p className="mt-5 text-center text-xs text-[#737b70]">
              Don't have an account?
              <Link
                to="/register"
                className="ml-1 font-semibold text-[#006400] transition-colors cursor-pointer"
              >
                Register
              </Link>
            </p>

            {/* TRUST FOOTER */}
            <div className="mt-4 pt-4 border-t border-[#edf0e9] flex items-center justify-center gap-4 text-[10px] text-[#006400]">
              <span className="flex items-center gap-1">
                <ShieldIcon />
                Secure
              </span>

              <span className="flex items-center gap-1">
                <Leaf size={11} />
                Agriculture
              </span>

              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} />
                Simple
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const ShieldIcon = () => (
  <svg
    width="11"
    height="11"
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