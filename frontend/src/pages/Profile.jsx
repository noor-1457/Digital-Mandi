import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Pencil,
  Save,
  X,
  ShieldCheck,
  Tractor,
  ArrowBigLeft,
} from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= GET PROFILE =================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("PROFILE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      setProfile(data.user);
      setFormData(data.user);
    } catch (error) {
      console.error("Profile Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= EDIT =================

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  // ================= CANCEL =================

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // ================= UPDATE PROFILE =================

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          address: formData.address,
          city: formData.city,
          province: formData.province,

          ...(profile.userRole === "farmer" && {
            farmName: formData.farmName,
            farmLocation: formData.farmLocation,
            primaryCropType: formData.primaryCropType,
          }),
        }),
      });

      const data = await response.json();

      console.log("UPDATE PROFILE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data.user);
      setFormData(data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Update Profile Error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8f5] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#1B5E20]"></div>

          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-[#f6f8f5] flex items-center justify-center px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-red-600">{error}</p>

          <button
            onClick={fetchProfile}
            className="rounded-lg bg-[#12372A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1B5E20] cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f5] pt-10 lg:ml-72 px-4 sm:px-6 pb-12">
      {" "}
      {/* PAGE HEADER */}
      <div className=" mb-8 w-full">
        <h1 className="text-3xl font-bold text-[#006400]">My Profile</h1>

        <p className="mt-1 text-gray-500">
          Manage your personal information and account details.
        </p>
      </div>
      <div className="w-full">
        {/* PROFILE HEADER */}
        <div className="overflow-hidden rounded-2xl border border-[#fdd835] bg-white shadow-sm">
          {/* COVER */}
          <div className="h-32 bg-gradient-to-r from-[#006400] via-[#017001] to-[#fdd835] text-white"></div>

          <div className="px-6 pb-6 md:px-8">
            <div className="-mt-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              {/* INFO */}
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                {/* USER INFO */}
                <div className="pb-8">
                  <h2 className="text-2xl font-bold text-white">
                    {profile.fullName}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                      {profile.userRole}
                    </span>
                    <div className="bg-[#fdd835] rounded-full font-semibold p-1">
                      <span className="flex items-center gap-1 text-xs text-[#006400]">
                        <ShieldCheck size={14} className="text-[#006400]" />
                        Verified Account
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* EDIT BUTTON */}
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#fdd835] to-[#006400] px-5 py-2.5 font-medium text-white transition hover:bg-[#1B5E20] cursor-pointer"
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ERROR AFTER UPDATE */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* PERSONAL INFORMATION */}
        <div className="mt-6 rounded-2xl border border-[#fdd835] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your basic account information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* FULL NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-600"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-600"
                />
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Email cannot be changed.
              </p>
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-600"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-600"
                />
              </div>
            </div>

            {/* CITY */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-600"
              />
            </div>

            {/* PROVINCE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Province
              </label>

              <input
                type="text"
                name="province"
                value={formData.province || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-600"
              />
            </div>
          </div>

          {/* FARMER INFORMATION */}
          {profile.userRole === "farmer" && (
            <div className="mt-10 border-t border-gray-100 pt-8">
              <div className="mb-7">
                <div className="flex items-center gap-2">
                  <Tractor size={21} className="text-[#1B5E20]" />

                  <h2 className="text-xl font-bold text-gray-900">
                    Farm Information
                  </h2>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Information about your farm and agricultural activities.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* FARM NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Farm Name
                  </label>

                  <input
                    type="text"
                    name="farmName"
                    value={formData.farmName || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  />
                </div>

                {/* FARM LOCATION */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Farm Location
                  </label>

                  <input
                    type="text"
                    name="farmLocation"
                    value={formData.farmLocation || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  />
                </div>

                {/* PRIMARY CROP */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Primary Crop Type
                  </label>

                  <input
                    type="text"
                    name="primaryCropType"
                    value={formData.primaryCropType || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SAVE / CANCEL */}
          {isEditing && (
            <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-6">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-red-700 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg  bg-gradient-to-r from-[#fdd835] to-[#006400] cursor-pointer px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1B5E20] disabled:opacity-50"
              >
                <Save size={17} />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
