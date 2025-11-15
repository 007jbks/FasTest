"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function ContactPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("userToken");

      // No token → redirect
      if (!token) {
        router.push("/login");
        return;
      }

      // Decode payload
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Expired token → redirect
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("userToken");
        router.push("/login");
        return;
      }
    } catch {
      // Malformed token → redirect
      localStorage.removeItem("userToken");
      router.push("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/10 p-10 rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

        <form
          action="https://formsubmit.co/kartik.orion.dev@gmail.com"
          method="POST"
          className="space-y-6"
        >
          {/* Disable Captcha */}
          <input type="hidden" name="_captcha" value="false" />

          {/* Redirect after success */}
          <input
            type="hidden"
            name="_next"
            value="http://localhost:3000/contact?sent=true"
          />

          <div>
            <label className="block mb-2 text-sm">Your Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Your Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Message</label>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-lg font-semibold hover:opacity-90"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
