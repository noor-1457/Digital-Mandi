import { Link } from "react-router-dom";
import { FaLeaf, FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#006400] text-white">
      {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* ================= BRAND ================= */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#e5efc9] flex items-center justify-center">
                <FaLeaf size={18} className="text-[#26734d]" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Digital Mandi</h2>
                <p className="text-[8px] tracking-[0.15em] text-[#cbd9bd]">
                  FRESH • LOCAL • TRUSTED
                </p>
              </div>
            </Link>

            <p className="mt-3 text-xs leading-relaxed text-white/65 max-w-xs">
              A smart agricultural marketplace connecting farmers and buyers through a simple digital platform.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#26734d] transition-colors">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#26734d] transition-colors">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#26734d] transition-colors">
                <FaTwitter size={14} />
              </a>
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/" className="text-xs text-white/65 hover:text-white transition-colors">Home</Link>
              <Link to="/products" className="text-xs text-white/65 hover:text-white transition-colors">Products</Link>
              <Link to="/about" className="text-xs text-white/65 hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="text-xs text-white/65 hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* ================= CUSTOMER SUPPORT ================= */}
          <div>
            <h3 className="text-sm font-semibold">Customer Support</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/faq" className="text-xs text-white/65 hover:text-white transition-colors">FAQs</Link>
              <Link to="/cart" className="text-xs text-white/65 hover:text-white transition-colors">Shopping Cart</Link>
              <Link to="/wishlist" className="text-xs text-white/65 hover:text-white transition-colors">Wishlist</Link>
              <Link to="/login" className="text-xs text-white/65 hover:text-white transition-colors">My Account</Link>
            </div>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <h3 className="text-sm font-semibold">Get In Touch</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt size={14} className="text-[#b8d875] shrink-0" />
                <p className="text-xs text-white/65">Lahore, Pakistan</p>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt size={13} className="text-[#b8d875] shrink-0" />
                <p className="text-xs text-white/65">+92 300 0000000</p>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope size={14} className="text-[#b8d875] shrink-0" />
                <p className="text-xs text-white/65 break-all">support@digitalmandi.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="text-[10px] text-white/50">
            © {new Date().getFullYear()} Digital Mandi. All rights reserved.
          </p>
          <p className="text-[10px] text-white/50">
            Smart Agricultural Marketplace
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;