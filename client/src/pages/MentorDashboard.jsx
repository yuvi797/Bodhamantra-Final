import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mentorAPI, requestAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import {
  FiLogOut,
  FiUsers,
  FiClock,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiPhone,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    bio: "",
    expertise: "",
    availableHours: "",
    isCurrentlyAvailable: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, requestsRes] = await Promise.all([
        mentorAPI.getMyProfile(),
        requestAPI.getMentorRequests(),
      ]);

      const profileData =
        profileRes?.data?.data?.mentor ||
        profileRes?.data?.mentor ||
        profileRes?.data;
      const requestsData =
        requestsRes?.data?.data?.requests || requestsRes?.data || [];

      setProfile(profileData);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await requestAPI.updateRequestStatus(requestId, "ACCEPTED");
      toast.success("Request accepted!");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await requestAPI.updateRequestStatus(requestId, "DECLINED");
      toast.success("Request declined");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to decline request");
    }
  };

  const openEditModal = () => {
    setEditForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      expertise: Array.isArray(profile?.expertise)
        ? profile.expertise.join(", ")
        : "",
      availableHours: profile?.availableHours || "",
      isCurrentlyAvailable: profile?.isCurrentlyAvailable || false,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: editForm.name,
        phone: editForm.phone,
        bio: editForm.bio,
        expertise: editForm.expertise
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        availableHours: editForm.availableHours,
        isCurrentlyAvailable: editForm.isCurrentlyAvailable,
      };

      await mentorAPI.updateProfile(updateData);
      toast.success("Profile updated successfully!");
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const getStatusColor = (status) => {
    if (status === "PENDING") return "bg-yellow-100 text-yellow-700";
    if (status === "ACCEPTED") return "bg-green-100 text-green-700";
    if (status === "COMPLETED") return "bg-blue-100 text-blue-700";
    if (status === "DECLINED") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f2ff] to-[#ffffff]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f2ff] to-[#ffffff]">
        <div className="text-center">
          <p className="text-xl text-gray-600">Failed to load profile</p>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f2ff] to-[#ffffff] pb-16">
      <Toaster position="top-right" />

      {/* HEADER */}
      <header className="backdrop-blur-xl bg-white/70 border-b border-blue-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700 tracking-wide">
            BodhMantraa Mentor
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition-all shadow-md"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      {/* DASHBOARD TOP STATS */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Students Mentored */}
          <div className="glass-card p-6 rounded-2xl shadow-xl border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Students Mentored</p>
                <p className="text-4xl font-bold mt-2">
                  {profile?.numberOfStudentsMentored || 0}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-full">
                <FiUsers className="text-blue-600 text-3xl" />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="glass-card p-6 rounded-2xl shadow-xl border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Average Rating</p>
                <p className="text-4xl font-bold mt-2">
                  {profile?.ratings?.toFixed(1) || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-full">
                <FiStar className="text-yellow-600 text-3xl" />
              </div>
            </div>
          </div>

          {/* Requests */}
          <div className="glass-card p-6 rounded-2xl shadow-xl border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Pending Requests</p>
                <p className="text-4xl font-bold mt-2">
                  {requests.filter((r) => r.status === "PENDING").length}
                </p>
              </div>
              <div className="p-4 bg-orange-100 rounded-full">
                <FiClock className="text-orange-600 text-3xl" />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="glass-card p-6 rounded-2xl shadow-xl border border-blue-100">
            <p className="text-gray-600 font-medium">Availability</p>
            <button
              className={`mt-3 px-5 py-2 font-semibold rounded-full shadow-md transition-all
                ${
                  profile?.isCurrentlyAvailable
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
            >
              {profile?.isCurrentlyAvailable ? "Available" : "Not Available"}
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-xl p-2 flex gap-3 border border-blue-100">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 font-bold rounded-lg transition-all ${
              activeTab === "requests"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-blue-50"
            }`}
          >
            Requests ({requests.length})
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 font-bold rounded-lg transition-all ${
              activeTab === "profile"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-blue-50"
            }`}
          >
            My Profile
          </button>
        </div>
      </div>

      {/* REQUESTS SECTION */}
      {activeTab === "requests" && (
        <div className="max-w-6xl mx-auto px-6 mt-8 space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <FiUsers className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <p className="text-gray-600 text-lg">No requests yet</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req._id}
                className="glass-card p-6 rounded-2xl shadow-xl border border-blue-100"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{req.title}</h3>
                    <p className="text-gray-600 mt-1">
                      👨‍🎓 {req.student?.name || "Unknown Student"} —{" "}
                      {req.student?.email || "N/A"}
                    </p>
                    <p className="bg-gray-50 p-4 rounded-xl mt-4 text-gray-700 border border-gray-200">
                      {req.description}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 h-fit rounded-full text-sm font-bold ${getStatusColor(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                </div>

                {req.status === "PENDING" && (
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => handleAcceptRequest(req._id)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-green-700"
                    >
                      <FiCheckCircle /> Accept
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req._id)}
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-red-700"
                    >
                      <FiXCircle /> Decline
                    </button>
                  </div>
                )}

                {req.status === "ACCEPTED" && req.student?.phone && (
                  <div className="mt-5 flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                    <FiPhone className="text-green-600 text-xl" />
                    <span className="text-sm text-gray-700 font-medium">
                      Student Contact:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {req.student.phone}
                    </span>
                    <a
                      href={`https://wa.me/${req.student.phone.replace(
                        /[^0-9]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      Contact on WhatsApp
                    </a>
                  </div>
                )}

                {req.status === "COMPLETED" && (
                  <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700">
                      <FiCheckCircle className="text-xl" />
                      <span className="font-semibold">Session Completed</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* PROFILE SECTION */}
      {activeTab === "profile" && (
        <div className="max-w-4xl mx-auto px-6 mt-10 glass-card p-8 rounded-3xl border border-blue-100 shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {profile?.name}
            </h2>

            <button
              onClick={openEditModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 shadow-lg"
            >
              <FiEdit /> Edit
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <Info label="Email" value={profile?.email} />
            <Info label="Phone" value={profile?.phone} />
            <Info
              label="Available Hours"
              value={`${profile?.availableHours || 0} hrs/day`}
            />
            <Info label="Bio" value={profile?.bio || "No bio available"} />

            <div>
              <h4 className="text-gray-500 font-semibold mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-3">
                {(profile?.expertise || []).map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full border border-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-blue-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows="4"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell students about your experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expertise (comma separated)
                </label>
                <input
                  type="text"
                  value={editForm.expertise}
                  onChange={(e) =>
                    setEditForm({ ...editForm, expertise: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="React, Node.js, Java, DSA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Hours Per Day
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={editForm.availableHours}
                  onChange={(e) =>
                    setEditForm({ ...editForm, availableHours: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="availability"
                  checked={editForm.isCurrentlyAvailable}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isCurrentlyAvailable: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="availability"
                  className="text-sm font-medium text-gray-700"
                >
                  Currently Available for Mentoring
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, value }) => (
  <div className="pb-4 border-b border-gray-200">
    <p className="text-gray-500 text-sm font-semibold">{label}</p>
    <p className="text-gray-800 text-lg">{value}</p>
  </div>
);
