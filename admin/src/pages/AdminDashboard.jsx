import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getAllMentors,
  approveMentor,
  rejectMentor,
  getAllRequests,
  getStats,
} from "../utils/api";

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [mentorFilter, setMentorFilter] = useState("pending");

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "mentors") {
      fetchMentors();
    } else if (activeTab === "requests") {
      fetchRequests();
    }
  }, [activeTab, mentorFilter]);

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      console.log(response);

      setUsers(response.data.data.students);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const response = await getAllMentors(mentorFilter);
      setMentors(response.data.data.mentors);
      console.log("mentors", mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await getAllRequests();
      setRequests(response.data.data.requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMentor = async (mentorId) => {
    try {
      await approveMentor(mentorId);
      fetchMentors();
      fetchStats();
      alert("Mentor approved successfully!");
    } catch (error) {
      alert(
        "Error approving mentor: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleRejectMentor = async (mentorId) => {
    if (window.confirm("Are you sure you want to reject this mentor?")) {
      try {
        await rejectMentor(mentorId);
        fetchMentors();
        alert("Mentor rejected successfully!");
      } catch (error) {
        alert(
          "Error rejecting mentor: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      accepted: "bg-blue-100 text-blue-800",
      declined: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome, {admin?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("stats")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "stats"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Statistics
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setActiveTab("mentors")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "mentors"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Mentors
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "requests"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Requests
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "stats" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                Platform Statistics
              </h2>
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="text-blue-600 text-sm font-medium mb-2">
                      Total Users
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {stats.totalUsers || 0}
                    </div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="text-green-600 text-sm font-medium mb-2">
                      Approved Mentors
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {stats.approvedMentors || 0}
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="text-yellow-600 text-sm font-medium mb-2">
                      Pending Mentors
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {stats.pendingMentors || 0}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-purple-600 text-sm font-medium mb-2">
                      Total Requests
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {stats.totalRequests || 0}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Loading statistics...
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">All Users</h2>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading users...
                </div>
              ) : users?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users?.map((user) => (
                        <tr key={user?._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user?.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user?.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user?.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "mentors" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Mentors Management</h2>
                <select
                  value={mentorFilter}
                  onChange={(e) => setMentorFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Mentors</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading mentors...
                </div>
              ) : mentors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No mentors found
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {mentors.map((mentor) => (
                    <div
                      key={mentor._id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold">
                              {mentor.name}
                            </h3>
                            {getStatusBadge(mentor.verificationStatus)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">
                                Email:{" "}
                                <span className="text-gray-900">
                                  {mentor.email}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                Phone:{" "}
                                <span className="text-gray-900">
                                  {mentor.phone}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                Service:{" "}
                                <span className="text-gray-900">
                                  {mentor.service}
                                </span>
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                Available Hours (per day):{" "}
                                <span className="text-gray-900">
                                  {mentor.availableHours} hrs
                                </span>
                              </p>
                              <p className="text-gray-600">
                                Students Mentored:{" "}
                                <span className="text-gray-900">
                                  {mentor.numberOfStudentsMentored}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                Rating:{" "}
                                <span className="text-gray-900">
                                  {mentor.ratings || 0} ⭐
                                </span>
                              </p>
                            </div>
                          </div>

                          {mentor.idCardUrl && (
                            <div className="mt-4">
                              <p className="text-gray-600 text-sm mb-2">
                                ID Card:
                              </p>
                              <a
                                href={mentor.idCardUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm underline"
                              >
                                View ID Card
                              </a>
                            </div>
                          )}
                        </div>

                        {mentor.verificationStatus === "pending" && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleApproveMentor(mentor._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectMentor(mentor._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">All Requests</h2>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading requests...
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No requests found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mentor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {requests.map((request) => (
                        <tr key={request._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.student?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.mentor?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="max-w-xs">
                              <p className="font-medium">{request.title}</p>
                              <p className="text-gray-500 text-xs truncate">
                                {request.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(request.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
