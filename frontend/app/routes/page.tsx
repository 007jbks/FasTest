"use client";
import { useState } from "react";
import {
  Menu,
  Home,
  Database,
  User,
  Settings,
  X,
  Mail,
  FileText,
  PlusCircle,
  Search,
  ChevronLeft,
  Filter,
  Edit,
  Trash2,
} from "lucide-react";

const mockRoutes = [
  {
    id: 1,
    name: "/api/products",
    method: "GET",
    description: "Fetches a list of all products.",
    totalTests: 25,
    passPercentage: 92,
  },
  {
    id: 2,
    name: "/api/products/:id",
    method: "GET",
    description: "Fetches details of a specific product by its ID.",
    totalTests: 15,
    passPercentage: 100,
  },
  {
    id: 3,
    name: "/api/orders",
    method: "POST",
    description: "Creates a new order with the provided items.",
    totalTests: 30,
    passPercentage: 85,
  },
  {
    id: 4,
    name: "/api/users/register",
    method: "POST",
    description: "Registers a new user account.",
    totalTests: 40,
    passPercentage: 95,
  },
  {
    id: 5,
    name: "/api/users/login",
    method: "POST",
    description: "Authenticates a user and returns a token.",
    totalTests: 18,
    passPercentage: 89,
  },
];

export default function ProjectRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: Home, label: "Home", active: false, link: "/dashboard" },
    {
      icon: Database,
      label: "Repository",
      active: true,
      link: "/repository",
    },
    { icon: User, label: "Account", active: false, link: "/account" },
    { icon: Settings, label: "Settings", active: false, link: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Animated background blur circles */}
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

      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <a
              href="/repository"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-2"
            >
              <ChevronLeft size={20} />
              Back to Repository
            </a>
            <h1 className="text-4xl font-bold tracking-wider">
              E-commerce Platform API Routes
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search routes..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white/15 transition-all duration-300"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300">
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </header>

        <div className="space-y-4">
          {mockRoutes.map((route) => (
            <div
              key={route.id}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      route.method === "GET"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {route.method}
                  </span>
                  <h2 className="text-xl font-semibold font-mono">
                    {route.name}
                  </h2>
                </div>
                <p className="text-gray-300 text-sm">{route.description}</p>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-gray-400 text-sm">Total Tests</p>
                  <p className="text-2xl font-bold">{route.totalTests}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Pass Rate</p>
                  <p
                    className={`text-2xl font-bold ${
                      route.passPercentage > 90
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {route.passPercentage}%
                  </p>
                </div>
                <a
                  href="/tests"
                  className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
                >
                  View Tests
                </a>
                <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                  <Edit size={20} />
                </button>
                <button className="p-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
