"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  Database,
  User,
  Settings,
  Menu,
  X,
  Mail,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";

const base_url = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState("User");
  const [stats, setStats] = useState([
    { value: "0", label: "Tests" },
    { value: "0", label: "APIs" },
    { value: "0", label: "Routes" },
  ]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const getdata = async () => {
      // Check for cached data first
      const cachedData = sessionStorage.getItem("dashboardData");
      if (cachedData) {
        const { stats, chartData, username } = JSON.parse(cachedData);
        setStats(stats);
        setChartData(chartData);
        setUsername(username);
        return; // Exit if we have cached data
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        // Fetch username
        const userResponse = await fetch(`${base_url}/auth/me`, {
          headers: { token },
        });
        let username = "User";
        if (userResponse.ok) {
          const userData = await userResponse.json();
          username = userData.username;
          setUsername(username);
        } else {
          console.error("Failed to fetch username");
        }

        const response = await fetch(`${base_url}/dashboard/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (response.ok) {
          const data = await response.json();

          const stats = [
            { value: String(data.total_tests), label: "Tests" },
            { value: String(data.total_urls), label: "APIs" },
            { value: String(data.total_routes), label: "Routes" },
          ];
          setStats(stats);

          const weeklyData = data.weekly_tests;
          const today = new Date();
          const days = [];
          const dayLabels = [];
          const dayShortNames = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ];

          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const dateString = `${year}-${month}-${day}`;

            const count = weeklyData[dateString] || 0;
            days.push(count);
            dayLabels.push(dayShortNames[date.getDay()]);
          }

          const maxCount = Math.max(...days, 1);

          const chartData = days.map((count, index) => ({
            height: count > 0 ? (count / maxCount) * 100 : 2,
            color: count > 0 ? "bg-green-400" : "bg-red-500/70",
            label: dayLabels[index],
            count: count,
          }));
          setChartData(chartData);

          // Cache the new data
          sessionStorage.setItem(
            "dashboardData",
            JSON.stringify({ stats, chartData, username }),
          );
        } else {
          console.error("Failed to fetch dashboard data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
    { icon: User, label: "Account", active: false, link: "./dashboard" },
    { icon: Settings, label: "Settings", active: false, link: "./dashboard" },
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

      <div
        className={`${
          sidebarOpen ? "w-60" : "w-0"
        } backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out overflow-hidden relative z-10`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-blue-500/5 pointer-events-none"></div>

        <div className="p-6 relative">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 text-gray-300 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  item.active
                    ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-400/30 backdrop-blur-sm shadow-lg shadow-purple-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                }`}
              >
                <item.icon
                  size={20}
                  className={`${
                    item.active
                      ? "text-purple-300"
                      : "group-hover:text-purple-300 transition-colors"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-3 text-sm border-t border-white/10 backdrop-blur-sm relative">
          <a
            href="#"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
          >
            <Mail
              size={16}
              className="group-hover:text-purple-300 transition-colors"
            />
            <span>Contact Us</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
          >
            <FileText
              size={16}
              className="group-hover:text-purple-300 transition-colors"
            />
            <span>Policies</span>
          </a>
        </div>
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 text-gray-300 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-lg backdrop-blur-xl border border-white/20"
        >
          <Menu size={24} />
        </button>
      )}

      <div className="flex-1 overflow-auto relative z-10">
        <div className="p-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <div className="flex items-center justify-between mb-12 relative">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400 to-green-500 shadow-lg shadow-lime-400/30 flex-shrink-0">
                  <img
                    src={"https://avatar.iran.liara.run/public/boy"}
                    alt="User Avatar"
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
              <Link href="./main">
                <button className="flex items-center gap-2 bg-gradient-to-br from-lime-400 to-green-500 text-black font-bold py-3 px-5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-lime-500/50 z-20">
                  <Plus className="w-5 h-5" />
                  <span>New Test</span>
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-purple-400/50 hover:bg-white/10"
                >
                  <p className="text-sm text-purple-200/70 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <h3 className="text-lg mb-6 font-normal relative">
              Last Week's Insights
            </h3>
            <div className="backdrop-blur-md bg-purple-500/10 border border-purple-500/20 rounded-xl p-8 h-64 flex flex-col relative">
              <div className="flex-grow flex items-end justify-around w-full gap-3">
                {chartData.map((bar, index) => (
                  <div
                    key={index}
                    className="w-16 h-full flex flex-col justify-end items-center group"
                  >
                    <div className="text-xs text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.count}
                    </div>
                    <div
                      className={`${bar.color} w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer shadow-lg`}
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
