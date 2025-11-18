import { FaCheckCircle } from "react-icons/fa";
import {
  FaUserGraduate,
  FaComments,
  FaVideo,
  FaBook,
  FaLock,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 md:px-10 py-3 md:py-4 bg-white shadow-sm border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            BodhMantraa
          </h1>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <Link
            to="/"
            className="text-sm sm:text-base text-gray-700 font-medium hover:text-indigo-600 transition-colors hidden sm:inline-block"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-sm sm:text-base text-gray-700 font-medium hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register/student"
            className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-sm sm:text-base bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-10 lg:px-20 py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
            Get Your Doubts Solved by Trusted Seniors
          </h1>
          <p className="text-lg mb-6 text-gray-700">
            BodhMantraa connects students with experienced mentors who solve
            your study doubts quickly with clear explanations. Pay only the
            mentor fee — no platform charge.
          </p>
          <Link to="/register/student">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition">
              Get Started
            </button>
          </Link>
        </div>

        <img
          src="/bodh.png"
          className="w-100 lg:w-[550px] mt-10 lg:mt-0"
        />
      </section>

      {/* Features */}
      <section className="py-20 px-10 lg:px-20 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-14">
          Why BodhMantraa?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow hover:shadow-md transition">
            <FaUserGraduate className="text-3xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Choose Your Mentor</h3>
            <p className="text-gray-600">
              Pick verified seniors based on skills, ratings, and course
              experience.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow hover:shadow-md transition">
            <FaComments className="text-3xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">
              Request Doubt Solution
            </h3>
            <p className="text-gray-600">
              Send your doubt with a title & description. Mentor accepts or
              rejects.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow hover:shadow-md transition">
            <FaCheckCircle className="text-3xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Pay After Completion</h3>
            <p className="text-gray-600">
              Students pay only ₹50 per solved doubt once satisfied with the
              answer.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow hover:shadow-md transition">
            <FaVideo className="text-3xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Chat & Video Call</h3>
            <p className="text-gray-600">
              Soon: live chat, video calls, and screen sharing for deeper
              clarity.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-8 shadow hover:shadow-md transition">
            <FaBook className="text-3xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">
              University Question Bank
            </h3>
            <p className="text-gray-600">
              Soon: Access PYQs, teacher notes, and curated study material soon.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-8 shadow hover:shadow-md transition">
            <FaLock className="text-3xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Soon: Trusted and smooth payments with integrated gateway.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 bg-gray-900 text-white mt-10">
        © 2025 BodhMantraa — Empowering Students Through Knowledge
      </footer>
    </div>
  );
}
