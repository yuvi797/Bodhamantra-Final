import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mentorAPI, requestAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
  FiLogOut,
  FiUser,
  FiStar,
  FiClock,
  FiUsers,
  FiPhone,
  FiSend,
  FiCheckCircle,
  FiMessageSquare,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Footer from "../components/Footer";

/**
 * StudentDashboard.jsx
 * - Modern glassmorphic UI
 * - Keeps original API logic (fetchData, createRequest, completeAndReview)
 * - Replace existing file with this for a polished UI
 */

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mentors, setMentors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mentors");

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestForm, setRequestForm] = useState({ title: "", description: "" });
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mentorsRes, requestsRes] = await Promise.all([
        mentorAPI.getApprovedMentors(),
        requestAPI.getMyRequests(),
      ]);

      const mentorsData =
        mentorsRes?.data?.data?.mentors ||
        mentorsRes?.data?.mentors ||
        mentorsRes?.data ||
        [];

      const requestsData =
        requestsRes?.data?.data?.requests ||
        requestsRes?.data?.requests ||
        requestsRes?.data ||
        [];

      setMentors(Array.isArray(mentorsData) ? mentorsData : []);
      setMyRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMentors([]);
      setMyRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openRequestModal = (mentor) => {
    setSelectedMentor(mentor);
    setRequestForm({ title: "", description: "" });
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSelectedMentor(null);
    setRequestForm({ title: "", description: "" });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMentor) return;
    try {
      await requestAPI.createRequest({
        mentorId: selectedMentor._id,
        title: requestForm.title,
        description: requestForm.description,
      });
      // feedback
      alert("Request sent successfully!");
      closeRequestModal();
      fetchData();
      setActiveTab("requests");
    } catch (error) {
      console.error(error);
      alert(
        "Failed to send request: " +
          (error?.response?.data?.message || "Unknown error")
      );
    }
  };

  const openReviewModal = (request) => {
    setSelectedRequest(request);
    setReviewForm({ rating: 5, comment: "" });
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      await requestAPI.completeAndReview(selectedRequest._id, reviewForm);
      alert("Review submitted successfully!");
      setShowReviewModal(false);
      setSelectedRequest(null);
      setReviewForm({ rating: 5, comment: "" });
      fetchData();
    } catch (error) {
      console.error(error);
      alert(
        "Failed to submit review: " +
          (error?.response?.data?.message || "Unknown error")
      );
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      ACCEPTED: "bg-green-50 text-green-700 border border-green-200",
      DECLINED: "bg-red-50 text-red-700 border border-red-200",
      COMPLETED: "bg-blue-50 text-blue-700 border border-blue-200",
    };
    return badges[status] || "bg-gray-50 text-gray-700 border border-gray-200";
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf6ff] to-white pb-20">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/70 border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700">
              BodhMantraa
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back,{" "}
              <span className="font-semibold text-gray-800">{user?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("mentors")}
              className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "mentors"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              Find Mentors
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "requests"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              My Requests ({myRequests.length})
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-shadow shadow"
            >
              <FiLogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Tabs for mobile */}
        <div className="md:hidden mb-6 flex gap-3">
          <button
            onClick={() => setActiveTab("mentors")}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              activeTab === "mentors"
                ? "bg-blue-600 text-white shadow"
                : "bg-white/60 text-gray-700"
            }`}
          >
            Mentors
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              activeTab === "requests"
                ? "bg-blue-600 text-white shadow"
                : "bg-white/60 text-gray-700"
            }`}
          >
            Requests ({myRequests.length})
          </button>
        </div>

        {/* Mentors view */}
        {activeTab === "mentors" && (
          <>
            {/* Top stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 rounded-2xl shadow-md border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Available Mentors</p>
                    <p className="text-2xl font-bold mt-2 text-gray-900">
                      {mentors.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <FiUsers className="text-blue-600 w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl shadow-md border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">My Requests</p>
                    <p className="text-2xl font-bold mt-2 text-gray-900">
                      {myRequests.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100">
                    <FiClock className="text-yellow-600 w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl shadow-md border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Top Rating</p>
                    <p className="text-2xl font-bold mt-2 text-gray-900">
                      {mentors.length ? (Math.max(...mentors.map(m=>m.ratings||0)).toFixed?.(1) ?? "N/A") : "N/A"}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-50">
                    <FiStar className="text-yellow-600 w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
                  <FiUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No mentors available yet.</p>
                </div>
              ) : (
                mentors.map((mentor) => (
                  <article
                    key={mentor._id}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition hover:-translate-y-1 border border-blue-100"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {mentor.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          <FiUser className="inline mr-1" /> {mentor.email}
                        </p>
                        <p className="text-sm text-gray-700 mt-3 line-clamp-3">
                          {mentor.bio || "No bio available."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {(mentor.expertise || []).slice(0, 5).map((s, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                              {s}
                            </span>
                          ))}
                          {mentor.expertise && mentor.expertise.length > 5 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{mentor.expertise.length - 5} more
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FiUsers className="text-blue-600" />
                            <span className="font-medium">
                              {mentor.numberOfStudentsMentored || 0} students
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FiClock
                              className={
                                mentor.isCurrentlyAvailable
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            />
                            <span
                              className={
                                "font-medium " +
                                (mentor.isCurrentlyAvailable ? "text-green-600" : "text-red-600")
                              }
                            >
                              {mentor.isCurrentlyAvailable ? "Available" : "Busy"}
                            </span>
                          </div>

                          <div className="ml-auto flex items-center gap-2">
                            <div className="bg-yellow-50 px-3 py-1 rounded-full text-yellow-700 font-semibold">
                              {mentor.ratings?.toFixed(1) ?? "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => openRequestModal(mentor)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-shadow shadow"
                      >
                        <FiSend className="inline mr-2" />
                        Send Request
                      </button>

                      {mentor.phone && (
                        <a
                          href={`https://wa.me/${mentor.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-green-700 hover:bg-green-50 transition"
                        >
                          <FaWhatsapp className="w-5 h-5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </article>
                ))
              )}
            </section>
          </>
        )}

        {/* Requests view */}
        {activeTab === "requests" && (
          <section className="mt-6 space-y-6">
            {myRequests.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-md">
                <FiCheckCircle className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <p className="text-gray-600">You haven't made any requests yet.</p>
                <button
                  onClick={() => setActiveTab("mentors")}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Find Mentors
                </button>
              </div>
            ) : (
              myRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white p-6 rounded-2xl shadow-md border border-blue-100"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold">Mentor:</span>{" "}
                        {request.mentor?.name || "Unknown"}
                      </p>

                      {request.status === "ACCEPTED" && request.mentor?.phone && (
                        <div className="mt-3 flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                          <FiPhone className="text-green-600" />
                          <span className="text-sm text-gray-700 font-medium">Contact:</span>
                          <a
                            href={`https://wa.me/${request.mentor.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green-700 font-semibold flex items-center gap-2"
                          >
                            <FaWhatsapp className="w-4 h-4" />
                            <span>{request.mentor.phone}</span>
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>

                      <div className="mt-4 text-xs text-gray-500">
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ""}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {request.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-sm text-gray-500">
                      {request.status === "COMPLETED" && request.review ? (
                        <span className="text-green-600 font-semibold">Reviewed ✓</span>
                      ) : (
                        <span>Created: <span className="font-medium text-gray-700">{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ""}</span></span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {request.status === "ACCEPTED" && !request.review && (
                        <button
                          onClick={() => openReviewModal(request)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                          <FiCheckCircle className="inline mr-2" />
                          Complete & Review
                        </button>
                      )}
                      {request.status === "PENDING" && (
                        <button
                          onClick={() => setActiveTab("mentors")}
                          className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg hover:bg-blue-100 transition font-semibold"
                        >
                          Browse Mentors
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </main>

      {/* Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Send Request</h3>
              <button onClick={closeRequestModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <p className="text-sm text-gray-600 mb-4">To: <span className="font-semibold">{selectedMentor.name}</span></p>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  required
                  value={requestForm.title}
                  onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Short title for your request"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows="4"
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what help you need..."
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={closeRequestModal} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Complete & Review</h3>
              <button onClick={() => { setShowReviewModal(false); setSelectedRequest(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <p className="text-sm text-gray-600 mb-4">Review for: <span className="font-semibold">{selectedRequest.mentor?.name || "Mentor"}</span></p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Rating</label>
                <select
                  required
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">5 — Excellent</option>
                  <option value="4">4 — Very Good</option>
                  <option value="3">3 — Good</option>
                  <option value="2">2 — Fair</option>
                  <option value="1">1 — Poor</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Comment</label>
                <textarea
                  rows="4"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowReviewModal(false); setSelectedRequest(null); }} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StudentDashboard;
