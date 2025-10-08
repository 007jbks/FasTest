"use client";
import React, { useState } from "react";
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

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { value: "85%", label: "Passed" },
    { value: "1300", label: "Tests" },
    { value: "45", label: "APIs" },
    { value: "100", label: "Routes" },
  ];

  const chartData = [
    { height: 50, color: "bg-green-400" },
    { height: 75, color: "bg-green-300" },
    { height: 70, color: "bg-green-300" },
    { height: 35, color: "bg-red-500" },
    { height: 60, color: "bg-green-400" },
    { height: 45, color: "bg-red-500" },
    { height: 73, color: "bg-green-300" },
  ];

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
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-60" : "w-0"} bg-gradient-to-b from-gray-950 via-gray-950 to-black flex flex-col transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-800`}
      >
        <div className="p-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                  item.active
                    ? "bg-gradient-to-r from-purple-600/20 to-orange-600/20 text-white border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <item.icon
                  size={20}
                  className={`${
                    item.active
                      ? "text-purple-400"
                      : "group-hover:text-purple-400 transition-colors"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-3 text-sm border-t border-gray-800">
          <a
            href="#"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <Mail
              size={16}
              className="group-hover:text-purple-400 transition-colors"
            />
            <span>Contact Us</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <FileText
              size={16}
              className="group-hover:text-purple-400 transition-colors"
            />
            <span>Policies</span>
          </a>
        </div>
      </div>

      {/* Toggle Button for Closed Sidebar */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-black overflow-auto">
        <div className="p-8">
          {/* Header Avatar */}
          {/*<div className="w-10 h-10 rounded-full bg-lime-400  shadow-lg shadow-lime-400/50">
            <Plus className="w-6 h-6 mx-auto text-black" />
          </div>*/}
          <Link href="./main">
            <button className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-full fixed top-5 right-5 hover:scale-105 transition-transform shadow-lg shadow-lime-500/50">
              <Plus className="w-6 h-6 mx-auto text-black" />
            </button>
          </Link>

          {/* Profile Card */}
          <div className="rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-lime-400 shadow-lg shadow-lime-400/30"></div>
                <h2 className="text-4xl font-normal">Hannah Smith</h2>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-8 justify-center">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-center group cursor-pointer"
                >
                  <svg className="w-36 h-36 transform -rotate-90 transition-transform group-hover:scale-110">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      className="transition-all"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <div className="text-2xl font-semibold group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="rounded-xl p-8">
            <h3 className="text-lg mb-6 font-normal">Last Week's Insights</h3>
            <div className="bg-purple-950/30 rounded-xl p-8 h-64 flex items-end justify-center gap-3">
              {chartData.map((bar, index) => (
                <div
                  key={index}
                  className={`${bar.color} w-16 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer`}
                  style={{ height: `${bar.height}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
