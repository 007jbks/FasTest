"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  Home,
  Database,
  User,
  Settings,
  X,
  Mail,
  FileText,
  Plus,
} from "lucide-react";

const base_url = "http://localhost:8000"; // FIXED

export default function Dashboard() {
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

  const [username, setUsername] = useState("User");
  const [stats, setStats] = useState([
    { value: "0", label: "Tests" },
    { value: "0", label: "Projects" },
    { value: "0", label: "Routes" },
  ]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    sessionStorage.removeItem("dashboardData");
    const getdata = async () => {
      const cachedData = sessionStorage.getItem("dashboardData");
      if (cachedData) {
        const { stats, chartData, username } = JSON.parse(cachedData);
        setStats(stats);
        setChartData(chartData);
        setUsername(username);
        return;
      }

      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        // Fetch username
        const userResponse = await fetch(`${base_url}/auth/me`, {
          headers: { token },
        });

        let username = "User";
        if (userResponse.ok) {
          const data = await userResponse.json();
          username = data.username;
          setUsername(username);
        }

        // Fetch dashboard data
        const response = await fetch(`${base_url}/dashboard/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch dashboard data");
          return;
        }

        const data = await response.json();

        // -------- FIXED HERE --------
        const stats = [
          { value: String(data.total_tests), label: "Tests" },
          { value: String(data.total_projects), label: "Projects" }, // FIXED
          { value: String(data.total_routes), label: "Routes" },
        ];
        setStats(stats);

        // --- weekly data ---
        const weeklyData = data.weekly_tests;
        const today = new Date();
        const days = [];
        const dayLabels = [];
        const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);

          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");

          const key = `${year}-${month}-${day}`;
          const count = weeklyData[key] || 0;

          days.push(count);
          dayLabels.push(names[d.getDay()]);
        }

        const maxCount = Math.max(...days, 1);

        const chartData = days.map((count, index) => ({
          height: count > 0 ? (count / maxCount) * 100 : 2,
          color: count > 0 ? "bg-green-400" : "bg-red-500/70",
          label: dayLabels[index],
          count,
        }));

        setChartData(chartData);

        // cache
        sessionStorage.setItem(
          "dashboardData",
          JSON.stringify({ stats, chartData, username }),
        );
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    getdata();
  }, []);

  const navItems = [
    { icon: Home, label: "Home", active: true, link: "./dashboard" },
    {
      icon: Database,
      label: "Repository",
      active: false,
      link: "./repository",
    },
    { icon: User, label: "Account", active: false, link: "./account" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Sidebar */}
      <div className="w-60 backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col transition-all duration-300 relative z-10">
        <div className="p-6 relative">
          <nav className="space-y-2 mt-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  item.active
                    ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-400/30 shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon
                  size={20}
                  className={`${
                    item.active
                      ? "text-purple-300"
                      : "group-hover:text-purple-300"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <a
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group cursor-pointer"
            href={"/contact"}
          >
            <Mail size={16} className="group-hover:text-purple-300" />
            <span>Contact Us</span>
          </a>
          <a
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group cursor-pointer mt-2"
            href="/policy"
          >
            <FileText size={16} className="group-hover:text-purple-300" />
            <span>Policies</span>
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative z-10">
        <div className="p-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400 to-green-500 shadow-lg">
                  <img
                    src="https://avatar.iran.liara.run/public/boy"
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Welcome, {username}
                  </h2>
                  <p className="text-purple-200/70 mt-1">
                    Here's your activity overview.
                  </p>
                </div>
              </div>

              <Link href="./Project">
                <button className="flex items-center gap-2 bg-gradient-to-br from-lime-400 to-green-500 text-black font-bold py-3 px-5 rounded-full hover:scale-105 shadow-lg">
                  <Plus className="w-5 h-5" />
                  <span>New Project</span>
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-400/50 hover:bg-white/10"
                >
                  <p className="text-sm text-purple-200/70 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl relative">
            <h3 className="text-lg mb-6">Last Week's Insights</h3>

            <div className="backdrop-blur-md bg-purple-500/10 border border-purple-500/20 rounded-xl p-8 h-64 flex flex-col">
              <div className="flex-grow flex items-end justify-around gap-3">
                {chartData.map((bar, index) => (
                  <div
                    key={index}
                    className="w-16 h-full flex flex-col justify-end items-center group"
                  >
                    <div className="text-xs text-gray-400 mb-1 opacity-0 group-hover:opacity-100">
                      {bar.count}
                    </div>
                    <div
                      className={`${bar.color} w-full rounded-t shadow-lg`}
                      style={{ height: `${bar.height}%` }}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="flex justify-around mt-2 border-t border-white/10 pt-2">
                {chartData.map((bar, index) => (
                  <div
                    key={index}
                    className="w-16 text-center text-xs text-gray-400"
                  >
                    {bar.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
