import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../utils/api";
import { studentRegisterSchema } from "../utils/validation";
import toast, { Toaster } from "react-hot-toast";
import { FiEye, FiEyeOff, FiUserPlus } from "react-icons/fi";
import Footer from "../components/Footer";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    branch: "",
    course: "",
    year: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate form data with Zod
      studentRegisterSchema.parse(formData);

      const response = await authAPI.registerStudent(formData);
      toast.success(
        response.data.message || "Registration successful! Please login."
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.name === "ZodError") {
        // Handle Zod validation errors
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors in the form");
      } else {
        // Handle API errors
        toast.error(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
        <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-blue-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
              BodhMantraa
            </h1>
            <p className="text-gray-500 text-sm">
              Your journey to success starts here
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Student Registration
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Create your account to connect with mentors
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.name ? "border-red-400" : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className={`appearance-none relative block w-full px-4 py-3 pr-12 border ${
                      errors.password ? "border-red-400" : "border-gray-300"
                    } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Min 8 chars"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.phone ? "border-red-400" : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="10 digit number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Course <span className="text-red-500">*</span>
                </label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.course ? "border-red-400" : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="e.g. B.Tech, BCA, MCA"
                  value={formData.course}
                  onChange={handleChange}
                />
                {errors.course && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.course}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Branch/Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  id="branch"
                  name="branch"
                  type="text"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.branch ? "border-red-400" : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="e.g. Computer Science"
                  value={formData.branch}
                  onChange={handleChange}
                />
                {errors.branch && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.branch}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="year"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Current Year/Semester
                </label>
                <select
                  id="year"
                  name="year"
                  className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FiUserPlus className="h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentRegister;
