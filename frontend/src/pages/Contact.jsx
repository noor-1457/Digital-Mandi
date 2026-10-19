import { useState } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Mail,
  Send,
  User,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import axios from "axios";
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // FAQ open/close state

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/contact", formData);
      
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // 5 second baad success message hata dein
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };


 

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-16 m-auto lg:pt-35">
     

        {/* ================= MAIN CONTENT ================= */}
        <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 justify-center items-center">
            {/* ---- FORM ---- */}
            <div className="rounded-2xl border border-[#e8ebdf] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-extrabold text-[#006400]">
                Send us a message
              </h2>
              <p className="mt-1 text-xs text-[#788174]">
                Fill the form below and we'll get back to you within 24 hours.
              </p>

              {/* Success */}
              {success && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-700">
                  <CheckCircle2 size={14} />
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Name */}
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name *"
                    required
                    className="w-full rounded-lg border border-[#dfe4d9] bg-[#fafbf8] pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-[#8da94d] focus:ring-2 focus:ring-[#a7c957]/20"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa296]"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    required
                    className="w-full rounded-lg border border-[#dfe4d9] bg-[#fafbf8] pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-[#8da94d] focus:ring-2 focus:ring-[#a7c957]/20"
                  />
                </div>

                {/* Subject */}
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject (optional)"
                  className="w-full rounded-lg border border-[#dfe4d9] bg-[#fafbf8] px-4 py-2.5 text-sm outline-none transition focus:border-[#8da94d] focus:ring-2 focus:ring-[#a7c957]/20"
                />

                {/* Message */}
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message *"
                  required
                  rows={5}
                  className="w-full resize-none rounded-lg border border-[#dfe4d9] bg-[#fafbf8] px-4 py-2.5 text-sm outline-none transition focus:border-[#8da94d] focus:ring-2 focus:ring-[#a7c957]/20"
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#006400] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#004d00] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}