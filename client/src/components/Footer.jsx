import { FiMail, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiLinkedin, FiInstagram } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-tr from-blue-900 to-blue-700 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-800 to-blue-600 opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">

        {/* Brand */}
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold mb-2">BodhMantraa</h3>
          <p className="text-lg text-green-200 font-medium">
            “We don’t charge any fees. Seniors help students at ₹50 per student.”
          </p>
        </div>

        {/* Contact + About */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting students with experienced mentors to guide their academic and career journey.
              We believe “Success grows faster when shared.”
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-green-300" />
                <a href="mailto:sinhayuvraj418@gmail.com" className="hover:text-green-400">
                  sinhayuvraj418@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-green-300" />
                <a href="tel:+917004322672" className="hover:text-green-400">
                  +91 7004322672
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FaWhatsapp className="w-5 h-5 text-green-400" />
                <a
                  href="https://wa.me/917004322672"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-300"
                >
                  Chat on WhatsApp
                </a>
              </li>

              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-green-300 mt-1" />
                <span>Quest College, Punjab, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team */}
        <div className="mb-10 text-center">
          <h4 className="text-xl font-semibold mb-6">Our Team</h4>

          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <div className="flex flex-col items-center hover:scale-105 transition-transform">
              <img
                src="/yuvraj.jpg"
                alt="Yuvraj Sinha"
                className="w-36 h-36 rounded-full object-cover shadow-xl mb-2"
              />
              <p className="text-white font-medium">Yuvraj Sinha</p>
              <p className="text-green-200 text-sm">Developer</p>
            </div>

            <div className="flex flex-col items-center hover:scale-105 transition-transform">
              <img
                src="/raman.jpg"
                alt="Raman"
                className="w-36 h-36 rounded-full object-cover shadow-xl mb-2"
              />
              <p className="text-white font-medium">Raman</p>
              <p className="text-green-200 text-sm">Developer</p>
            </div>

            <div className="flex flex-col items-center hover:scale-105 transition-transform">
              <img
                src="/kashif.jpg"
                alt="Kashif"
                className="w-36 h-36 rounded-full object-cover shadow-xl mb-2"
              />
              <p className="text-white font-medium">Kashif</p>
              <p className="text-green-200 text-sm">Developer</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-green-500 pt-4">
          <p className="text-gray-300 text-sm">© {currentYear} BodhMantraa</p>

          <div className="flex gap-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-all transform hover:scale-110">
              <FiFacebook className="w-5 h-5" />
            </a>

            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-all transform hover:scale-110">
              <FiTwitter className="w-5 h-5" />
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-all transform hover:scale-110">
              <FiLinkedin className="w-5 h-5" />
            </a>

            {/* ⭐ Instagram Added */}
            <a
              href="https://instagram.com/bodhamantra"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-all transform hover:scale-110"
            >
              <FiInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
