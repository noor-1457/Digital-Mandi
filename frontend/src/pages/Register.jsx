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

  //  HANDLE INPUT CHANGE

 // This function updates the formData state whenever an input field changes.
 // prev is used to ensure that we are updating the state based on the previous state, which is important for maintaining the other fields in formData.
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

  // HANDLE ROLE CHANGE 

  // This function updates the role state and the userRole field in formData when the user selects a role (Farmer or Buyer).
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    setFormData((prev) => ({
      ...prev,
      userRole: selectedRole,
    }));

    setError("");
    setSuccess("");
  };

  //  FORM SUBMIT 


  //e.preventDefault() is used to prevent the default form submission behavior, which would cause a page reload. Instead, we handle the submission with our own logic.
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check if no role is selected
    if (!role) {
      setError("Please select Farmer or Buyer.");
      return;
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Data sent to backend
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        userRole: role,

        // Farmer-specific fields
        farmName: role === "farmer" ? formData.farmName : "",
        farmLocation: role === "farmer" ? formData.farmLocation : "",
        primaryCropType:
          role === "farmer" ? formData.primaryCropType : "",
      };

      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        registrationData
      );

      console.log(response.data);

      setSuccess("Registration successful! You can now login.");

      // Clear form after successful registration
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
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f7f2] pt-24 pb-12 px-4 sm:px-6">

      {/*PAGE CONTAINER*/}

      <div className="max-w-2xl w-full mx-auto">

        <div className="flex justify-center items-center">

          {/*REGISTER CARD*/}

          <div className="w-full max-w-2xl">

            <div className="bg-white border border-[#e3e7dc] rounded-3xl shadow-[0_20px_60px_-25px_rgba(38,51,38,0.25)] p-6 sm:p-8">

              {/*CARD HEADER*/}

              <div className="text-center mb-7">

                <div className="flex justify-center mb-4">

                  <div className="w-12 h-12 rounded-2xl bg-[#eef3e4] flex items-center justify-center text-[#607b37]">
                    <Leaf size={24} />
                  </div>

                </div>

                <h2 className="font-display text-3xl sm:text-4xl text-[#293829]">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-[#7a8277]">
                  Join Digital Mandi as a Farmer or Buyer.
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


              {/*REGISTRATION FORM*/}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/*FULL NAME*/}

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa296]"
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


                {/*EMAIL + PHONE*/}

                <div className="grid sm:grid-cols-2 gap-4">

                  {/* Email */}

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


                  {/* Phone */}

                  <div className="relative">

                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa296]"
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

                </div>


                {/*ADDRESS*/}

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa296]"
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


                {/*CITY + PROVINCE*/}

                <div className="grid sm:grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="
                      w-full
                      rounded-xl
                      border border-[#dfe4d9]
                      bg-[#fafbf8]
                      px-4 py-3
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
                      rounded-xl
                      border border-[#dfe4d9]
                      bg-[#fafbf8]
                      px-4 py-3
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
                    <option value="Balochistan">
                      Balochistan
                    </option>
                    <option value="Gilgit-Baltistan">
                      Gilgit-Baltistan
                    </option>
                    <option value="Azad Kashmir">
                      Azad Kashmir
                    </option>

                  </select>

                </div>


                {/*ROLE*/}

                <div className="grid sm:grid-cols-2 gap-3">

                  {/* Farmer */}

                  <button
                    type="button"
                    onClick={() => handleRoleChange("farmer")}
                    className={`
                      flex items-center gap-3
                      p-3.5
                      rounded-xl
                      border
                      text-left
                      transition-all duration-300

                      ${
                        role === "farmer"
                          ? "border-[#8da94d] bg-[#eef3e4] text-[#536d2d]"
                          : "border-[#dfe4d9] bg-[#fafbf8] text-[#697267] hover:border-[#c6d2b5]"
                      }
                    `}
                  >

                    <Leaf size={20} />

                    <div>
                      <p className="text-sm font-semibold">
                        Farmer
                      </p>

                      <p className="text-xs opacity-70">
                        Manage farm information
                      </p>
                    </div>

                  </button>


                  {/* Buyer */}

                  <button
                    type="button"
                    onClick={() => handleRoleChange("buyer")}
                    className={`
                      flex items-center gap-3
                      p-3.5
                      rounded-xl
                      border
                      text-left
                      transition-all duration-300

                      ${
                        role === "buyer"
                          ? "border-[#c58b55] bg-[#f8eee5] text-[#966235]"
                          : "border-[#dfe4d9] bg-[#fafbf8] text-[#697267] hover:border-[#dcc5ae]"
                      }
                    `}
                  >

                    <User size={20} />

                    <div>
                      <p className="text-sm font-semibold">
                        Buyer
                      </p>

                      <p className="text-xs opacity-70">
                        Create your buyer profile
                      </p>
                    </div>

                  </button>

                </div>


                {/* Hidden role input for form submission */}

                <input
                  type="hidden"
                  name="role"
                  value={role}
                />


                {/*FARMER-SPECIFIC FIELDS*/}

                {role === "farmer" && (

                  <div className="space-y-4 p-4 rounded-2xl bg-[#f5f8ef] border border-[#e1e8d6]">

                    <div className="flex items-center gap-2">

                      <Wheat
                        size={17}
                        className="text-[#607b37]"
                      />

                      <p className="text-sm font-semibold text-[#536d2d]">
                        Farm Information
                      </p>

                    </div>


                    {/* Farm Name */}

                    <div className="relative">

                      <Building2
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa296]"
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
                          rounded-xl
                          border border-[#dfe4d9]
                          bg-white
                          pl-11 pr-4 py-3
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
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa296]"
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
                          rounded-xl
                          border border-[#dfe4d9]
                          bg-white
                          pl-11 pr-4 py-3
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
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa296]"
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
                          rounded-xl
                          border border-[#dfe4d9]
                          bg-white
                          pl-11 pr-4 py-3
                          text-sm
                          outline-none
                          focus:border-[#8da94d]
                          focus:ring-2 focus:ring-[#a7c957]/20
                        "
                      />

                    </div>

                  </div>

                )}


                {/*PASSWORD*/}

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


                {/*CONFIRM PASSWORD*/}

                <div className="relative">

                  <CheckCircle2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa296]"
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

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa296] hover:text-[#536d2d]"
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>


                {/*SUBMIT BUTTON*/}

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

                  {loading ? "Creating Account..." : "Create Account"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  )}

                </button>

              </form>


              {/*LOGIN LINK*/}

              <p className="mt-6 text-center text-sm text-[#737b70]">

                Already have an account?

                <Link
                  to="/login"
                  className="ml-1 font-semibold text-[#6f8f3f] hover:text-[#536d2d] transition-colors"
                >
                  Login
                </Link>

              </p>


              {/*TRUST FOOTER*/}

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

export default Register;