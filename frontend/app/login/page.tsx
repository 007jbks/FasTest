import Button from "@/Components/buttons";
import Link from "next/link";

export default function Login() {
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
          Login
        </h1>

        <form className="relative flex flex-col gap-4 justify-center items-center p-5">
          <input
            type="email"
            className="w-80 bg-white/5 backdrop-blur-sm m-2 placeholder:text-slate-400 text-white text-sm border border-white/20 rounded-xl px-4 py-3 transition-all duration-300 ease focus:outline-none focus:border-purple-400/50 focus:bg-white/10 hover:border-white/30 shadow-lg focus:shadow-purple-500/20"
            placeholder="Enter email..."
          />

          <input
            type="password"
            className="w-80 bg-white/5 backdrop-blur-sm m-2 placeholder:text-slate-400 text-white text-sm border border-white/20 rounded-xl px-4 py-3 transition-all duration-300 ease focus:outline-none focus:border-purple-400/50 focus:bg-white/10 hover:border-white/30 shadow-lg focus:shadow-purple-500/20"
            placeholder="Enter password..."
          />

          <Link
            href="./register"
            className="text-purple-300 hover:text-purple-200 transition-colors duration-200 text-sm mt-2 hover:underline"
          >
            New user? Register
          </Link>

          <div className="mt-2">
            <Button>Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
