import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../utils/api";
import { mentorRegisterSchema } from "../utils/validation";
import toast, { Toaster } from "react-hot-toast";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiKey,
  FiPhone,
  FiFeather,
  FiLayers,
  FiClock,
} from "react-icons/fi";

const MentorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    expertise: "",
    availableHours: "1",
    idCardUrl: "",
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
      mentorRegisterSchema.parse(formData);

      const expertiseArray = formData.expertise
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e);

      const submitData = {
        ...formData,
        expertise: expertiseArray,
      };

      const response = await authAPI.registerMentor(submitData);

      toast.success(
        response.data.message ||
          "Registration successful! Waiting for admin approval."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.name === "ZodError") {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
        toast.error("Fix the errors in the form");
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#eaf3ff] via-white to-[#f3e9ff] px-4 py-10">
      <Toaster position="top-right" />

      <div className="w-full max-w-2xl p-10 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-xl border border-blue-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 drop-shadow-md">
          Mentor Registration
        </h2>
        <p className="text-center text-gray-600 text-sm mt-1">
          Become a mentor & guide students to grow
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <InputField
            label="Full Name"
            name="name"
            icon={<FiUser />}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter your full name"
          />

          {/* Email */}
          <InputField
            label="Email"
            name="email"
            type="email"
            icon={<FiMail />}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your.email@example.com"
          />

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                className={`w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } bg-white/70 backdrop-blur-lg px-4 py-3 rounded-xl mt-1 shadow-sm focus:ring-2 focus:ring-blue-400`}
              />
              <button
                type="button"
                className="absolute right-3 top-4"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Phone */}
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            icon={<FiPhone />}
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="10 digit phone number"
          />

          {/* Available Hours */}
          <InputField
            label="Available Hours Per Day"
            name="availableHours"
            type="number"
            icon={<FiClock />}
            value={formData.availableHours}
            onChange={handleChange}
            error={errors.availableHours}
            placeholder="e.g. 2"
          />

          {/* ID Card URL */}
          <InputField
            label="ID Card URL (Optional)"
            name="idCardUrl"
            type="url"
            icon={<FiLayers />}
            value={formData.idCardUrl}
            onChange={handleChange}
            placeholder="https://example.com/id.jpg"
          />

          {/* Expertise */}
          <InputField
            label="Expertise (comma separated)"
            name="expertise"
            icon={<FiFeather />}
            value={formData.expertise}
            onChange={handleChange}
            error={errors.expertise}
            placeholder="React, Node.js, Java, DSA"
          />

          {/* Bio */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell students about your experience..."
              className={`w-full border 
                ${errors.bio ? "border-red-500" : "border-gray-300"}
                bg-white/70 backdrop-blur-xl px-4 py-3 rounded-xl mt-1 shadow-sm focus:ring-2 focus:ring-blue-400`}
            />
            {errors.bio && (
              <p className="text-sm text-red-600 mt-1">{errors.bio}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl transition-all"
          >
            {loading ? "Registering..." : "Register as Mentor"}
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  icon,
  error,
  placeholder,
  type = "text",
}) => (
  <div>
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="flex items-center gap-3 border bg-white/60 backdrop-blur-md px-4 py-3 rounded-xl shadow-sm mt-1 focus-within:ring-2 focus-within:ring-blue-400">
      <span className="text-gray-500">{icon}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-gray-800"
      />
    </div>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

export default MentorRegister;
