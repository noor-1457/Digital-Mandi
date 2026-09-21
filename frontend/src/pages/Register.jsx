import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  UserPlus,
  Leaf,
  Building2,
  Wheat,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  // FORM STATE

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    address: "",
    city: "",
    province: "",
    userRole: "",
    farmName: "",
    farmLocation: "",
    primaryCropType: "",
  });

  const [role, setRole] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // HANDLE INPUT CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // HANDLE ROLE CHANGE

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    setFormData((prev) => ({
      ...prev,
      userRole: selectedRole,
    }));

    setError("");
    setSuccess("");
  };

  // FORM SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!role) {
      setError("Please select Farmer or Buyer.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        userRole: role,

        farmName: role === "farmer" ? formData.farmName : "",
        farmLocation: role === "farmer" ? formData.farmLocation : "",
        primaryCropType: role === "farmer" ? formData.primaryCropType : "",
      };

      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        registrationData,
      );

      console.log(response.data);

      setSuccess("Registration successful! You can now login.");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNumber: "",
        address: "",
        city: "",
        province: "",
        userRole: "",
        farmName: "",
        farmLocation: "",
        primaryCropType: "",
      });

      setRole("");
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f7ed] via-[#f7fbf5] to-[#eaf3e6] pt-8 pb-10 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        {/* REGISTER CARD */}
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
              Create your account
            </h2>

            <p className="mt-1 text-xs text-[#7a8277]">
              Join Digital Mandi as a Farmer or Buyer.
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

          {/* REGISTRATION FORM */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* FULL NAME */}
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
              />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
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

            {/* EMAIL + PHONE */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              {/* Email */}
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

              {/* Phone */}
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
                />

                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Mobile Number"
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
            </div>

            {/* ADDRESS */}
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
              />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Complete Address"
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

            {/* CITY + PROVINCE */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="
                  w-full
                  rounded-lg
                  border border-[#dfe4d9]
                  bg-[#fafbf8]
                  px-4 py-2.5
                  text-sm text-[#293829]
                  placeholder:text-[#a1a89e]
                  outline-none
                  focus:border-[#8da94d]
                  focus:ring-2 focus:ring-[#a7c957]/20
                  transition-all
                "
              />

              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="
                  w-full
                  rounded-lg
                  border border-[#dfe4d9]
                  bg-[#fafbf8]
                  px-4 py-2.5
                  text-sm text-[#60695d]
                  outline-none
                  focus:border-[#8da94d]
                  focus:ring-2 focus:ring-[#a7c957]/20
                  transition-all
                "
              >
                <option value="" disabled>
                  Select Province
                </option>

                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="Khyber Pakhtunkhwa">
                  Khyber Pakhtunkhwa
                </option>
                <option value="Balochistan">Balochistan</option>
                <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                <option value="Azad Kashmir">Azad Kashmir</option>
              </select>
            </div>

            {/* ROLE */}
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Farmer */}
              <button
                type="button"
                onClick={() => handleRoleChange("farmer")}
                className={`
                  flex items-center gap-2.5
                  p-3
                  rounded-lg
                  border
                  text-left
                  transition-all duration-300
                  cursor-pointer

                  ${
                    role === "farmer"
                      ? "border-[#8da94d] bg-[#eef3e4] text-[#536d2d]"
                      : "border-[#dfe4d9] bg-[#fafbf8] text-[#697267] hover:border-[#c6d2b5]"
                  }
                `}
              >
                <Leaf size={18} />

                <div>
                  <p className="text-sm font-semibold">Farmer</p>

                  <p className="text-[10px] opacity-70">
                    Manage farm information
                  </p>
                </div>
              </button>

              {/* Buyer */}
              <button
                type="button"
                onClick={() => handleRoleChange("buyer")}
                className={`
                  flex items-center gap-2.5
                  p-3
                  rounded-lg
                  border
                  text-left
                  transition-all duration-300
                  cursor-pointer

                  ${
                    role === "buyer"
                      ? "border-[#c58b55] bg-[#f8eee5] text-[#966235]"
                      : "border-[#dfe4d9] bg-[#fafbf8] text-[#697267] hover:border-[#dcc5ae]"
                  }
                `}
              >
                <User size={18} />

                <div>
                  <p className="text-sm font-semibold">Buyer</p>

                  <p className="text-[10px] opacity-70">
                    Create your buyer profile
                  </p>
                </div>
              </button>
            </div>

            {/* Hidden role input */}
            <input type="hidden" name="role" value={role} />

            {/* FARMER-SPECIFIC FIELDS */}
            {role === "farmer" && (
              <div className="space-y-3.5 p-3.5 rounded-xl bg-[#f5f8ef] border border-[#e1e8d6]">
                <div className="flex items-center gap-2">
                  <Wheat size={15} className="text-[#607b37]" />

                  <p className="text-xs font-semibold text-[#536d2d]">
                    Farm Information
                  </p>
                </div>

                {/* Farm Name */}
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
                  />

                  <input
                    type="text"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleChange}
                    placeholder="Farm Name"
                    required
                    className="
                      w-full
                      rounded-lg
                      border border-[#dfe4d9]
                      bg-white
                      pl-10 pr-4 py-2.5
                      text-sm
                      outline-none
                      focus:border-[#8da94d]
                      focus:ring-2 focus:ring-[#a7c957]/20
                    "
                  />
                </div>

                {/* Farm Location */}
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
                  />

                  <input
                    type="text"
                    name="farmLocation"
                    value={formData.farmLocation}
                    onChange={handleChange}
                    placeholder="Farm Location"
                    required
                    className="
                      w-full
                      rounded-lg
                      border border-[#dfe4d9]
                      bg-white
                      pl-10 pr-4 py-2.5
                      text-sm
                      outline-none
                      focus:border-[#8da94d]
                      focus:ring-2 focus:ring-[#a7c957]/20
                    "
                  />
                </div>

                {/* Crop Type */}
                <div className="relative">
                  <Wheat
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
                  />

                  <input
                    type="text"
                    name="primaryCropType"
                    value={formData.primaryCropType}
                    onChange={handleChange}
                    placeholder="Primary Crop Type"
                    required
                    className="
                      w-full
                      rounded-lg
                      border border-[#dfe4d9]
                      bg-white
                      pl-10 pr-4 py-2.5
                      text-sm
                      outline-none
                      focus:border-[#8da94d]
                      focus:ring-2 focus:ring-[#a7c957]/20
                    "
                  />
                </div>
              </div>
            )}

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
                className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa296] hover:text-[#536d2d]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <CheckCircle2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
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
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa296] hover:text-[#536d2d]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
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

              {loading ? "Creating Account..." : "Create Account"}

              {!loading && (
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-5 text-center text-xs text-[#737b70]">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 font-semibold text-[#006400] transition-colors"
            >
              Login
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
  );
}

// SMALL SHIELD ICON

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

export default Register;