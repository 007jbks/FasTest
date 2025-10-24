"use client";
import Button from "@/Components/buttons";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const base_url = "http://127.0.0.1:8000";

const register = async function (user: string, em: string, pass: string) {
  const response = await fetch(`${base_url}/auth/signup`, {
    method: "POST",
    body: JSON.stringify({
      username: user,
      email: em,
      password: pass,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // The backend sends errors in a 'detail' field.
    throw new Error(data.detail || "An unknown error occurred.");
  }

  return data;
};

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before new submission

    try {
      const data = await register(username, email, password);
      console.log("Registration successful:", data);
      if (data.token) {
        localStorage.setItem("userToken", data.token);
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated background blur circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Glassmorphic card */}
      <div className="relative flex flex-col items-center justify-center p-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl w-100 shadow-2xl">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

        <h1 className="relative text-4xl font-bold pb-5 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Register
        </h1>

        <form
          onSubmit={handleRegister}
          className="relative flex flex-col gap-4 justify-center items-center p-5"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-80 bg-white/5 backdrop-blur-sm m-2 placeholder:text-slate-400 text-white text-sm border border-white/20 rounded-xl px-4 py-3 transition-all duration-300 ease focus:outline-none focus:border-purple-400/50 focus:bg-white/10 hover:border-white/30 shadow-lg focus:shadow-purple-500/20"
            placeholder="Enter username..."
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-80 bg-white/5 backdrop-blur-sm m-2 placeholder:text-slate-400 text-white text-sm border border-white/20 rounded-xl px-4 py-3 transition-all duration-300 ease focus:outline-none focus:border-purple-400/50 focus:bg-white/10 hover:border-white/30 shadow-lg focus:shadow-purple-500/20"
            placeholder="Enter email..."
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-80 bg-white/5 backdrop-blur-sm m-2 placeholder:text-slate-400 text-white text-sm border border-white/20 rounded-xl px-4 py-3 transition-all duration-300 ease focus:outline-none focus:border-purple-400/50 focus:bg-white/10 hover:border-white/30 shadow-lg focus:shadow-purple-500/20"
            placeholder="Enter password..."
          />

          {error && (
            <p className="text-red-400 bg-red-950/50 border border-red-400/30 rounded-lg px-4 py-2 text-sm">
              {error}
            </p>
          )}

          <Link
            href="./login"
            className="text-purple-300 hover:text-purple-200 transition-colors duration-200 text-sm mt-2 hover:underline"
          >
            Have an account? Login
          </Link>

          <button type="submit" className="mt-2">
            <Button>Register</Button>
          </button>
        </form>
      </div>
    </div>
  );
}
