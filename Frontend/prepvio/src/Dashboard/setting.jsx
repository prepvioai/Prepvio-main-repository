import React, { useEffect, useState } from "react";
import axios from "axios";
import { Settings } from "lucide-react";

function Account() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    bio: "",
  });

  // -------------------------
  // Fetch profile from backend
  // -------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/me",
          { withCredentials: true }
        );

        const u = res.data.user;

        setUser(u);
        setFormData({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          phone: u.phone || "",
          email: u.email || "",
          city: u.location?.city || "",
          state: u.location?.state || "",
          country: u.location?.country || "",
          pincode: u.location?.pincode || "",
          bio: u.bio || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // -------------------------
  // Input handler
  // -------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -------------------------
  // Save profile
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/api/users/me",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          bio: formData.bio,
          location: {
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.pincode,
          },
        },
        { withCredentials: true }
      );

      alert("Account updated successfully ✅");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading account...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">

      {/* ================= Profile Card ================= */}
      <div className="w-full bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-36 h-36">
          <img
            src={user?.avatarUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover rounded-full shadow-xl"
          />
        </div>

        <div className="flex flex-col gap-2 flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-sm text-gray-700">{formData.email}</p>
          <p className="text-gray-600 text-sm">
            {formData.bio || "No bio added yet"}
          </p>

          <div className="flex justify-center md:justify-start gap-3 mt-3">
            <button className="flex items-center gap-2 bg-indigo-500/60 text-white px-3 py-2 rounded-xl">
              <Settings className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* ================= Account Settings ================= */}
      <div className="w-full bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800">
          Account Settings
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Email Address" value={formData.email} disabled />
            <Input label="City" name="city" value={formData.city} onChange={handleChange} />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} />
            <Input label="Country" name="country" value={formData.country} onChange={handleChange} />
            <Input label="Pin Code" name="pincode" value={formData.pincode} onChange={handleChange} />

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-lg">Bio</label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded-xl bg-white/20 border border-white/50"
                placeholder="Write about yourself..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-indigo-700 hover:bg-indigo-900 text-white px-6 py-2 rounded-xl"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

// -------------------------
// Reusable Input Component
// -------------------------
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 text-lg">{label}</label>
    <input
      {...props}
      className="w-full mt-1 p-2 rounded-xl bg-white/20 border border-white/50"
    />
  </div>
);

export default Account;
