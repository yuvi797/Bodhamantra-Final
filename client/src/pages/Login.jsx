import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../utils/validation";
import toast, { Toaster } from "react-hot-toast";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    type: "student",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      loginSchema.parse(formData);

      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);

      navigate(user.type === "student" ? "/student/dashboard" : "/mentor/dashboard");
    } catch (err) {
      if (err.name === "ZodError") {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
        toast.error("Invalid Details");
      } else {
        toast.error(err.response?.data?.message || "Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 min-h-screen flex flex-col justify-between">
      <Toaster position="top-right" />

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/50">

          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-md">
              BodhMantraa
            </h1>
            <p className="text-gray-600 text-sm">
              Learn • Connect • Grow Together
            </p>
          </div>

          {/* Welcome text */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Welcome Back 👋
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl placeholder-gray-400 border ${
                  errors.email ? "border-red-400" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">⚠ {errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-xl border pr-12 placeholder-gray-400 ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 transition-all`}
                />

                <button
                  type="button"
                  className="absolute right-4 top-3 text-gray-500 hover:text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">⚠ {errors.password}</p>
              )}
            </div>

            {/* User Type */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                I am a
              </label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="student"
                    checked={formData.type === "student"}
                    onChange={handleChange}
                  />
                  <span className="text-gray-700">Student</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="mentor"
                    checked={formData.type === "mentor"}
                    onChange={handleChange}
                  />
                  <span className="text-gray-700">Mentor</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <FiLogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>

            {/* Signup Links */}
            <div className="text-center text-gray-600 text-sm my-3">
              Don't have an account?
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/register/student"
                className="text-center py-2 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-medium"
              >
                Student Sign Up
              </Link>

              <Link
                to="/register/mentor"
                className="text-center py-2 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-medium"
              >
                Mentor Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
