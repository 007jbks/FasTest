"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Play,
  Edit3,
  Save,
  ChevronDown,
  Plus,
  X,
  Home,
  Database,
  User,
  Settings,
  Mail,
  FileText,
  Menu,
  Circle,
} from "lucide-react";

// Sidebar Component
function Sidebar({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) {
  const navItems = [
    { icon: Home, label: "Generated Tests", page: "tests" },
    { icon: Database, label: "Repository", page: "repository" },
    { icon: Database, label: "Route Repository", page: "routes" },
    { icon: User, label: "Account", page: "account" },
    { icon: Settings, label: "Settings", page: "settings" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${sidebarOpen ? "w-60" : "w-0"} bg-gradient-to-b from-gray-950 via-gray-950 to-black flex flex-col transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-800 z-40`}
      >
        <div className="p-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={24} />
          </button>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(item.page)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                  currentPage === item.page
                    ? "bg-gradient-to-r from-purple-600/20 to-orange-600/20 text-white border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <item.icon
                  size={20}
                  className={`${
                    currentPage === item.page
                      ? "text-purple-400"
                      : "group-hover:text-purple-400 transition-colors"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
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
          className="fixed top-6 left-6 z-50 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg bg-gray-950/90 backdrop-blur-sm"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
}

// Repository Page Component
function RepositoryPage({ sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState("");

  const repositories = [
    { name: "/config/users", port: "8743", totalApis: 15, totalTests: 48 },
    { name: "/users", port: "8743", totalApis: 12, totalTests: 36 },
    { name: "/profiles", port: "8804", totalApis: 8, totalTests: 24 },
    { name: "/webhooks", port: "7432", totalApis: 5, totalTests: 15 },
    { name: "/something-new", port: "7743", totalApis: 3, totalTests: 12 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Repository</h1>
            <button className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-full hover:scale-105 transition-transform shadow-lg shadow-lime-500/50">
              <Plus className="w-6 h-6 mx-auto text-black" />
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search URLs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-purple-950/30 border border-purple-900/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
          <button className="px-6 py-4 bg-purple-950/30 border border-purple-900/50 rounded-xl text-white hover:bg-purple-900/40 transition-all flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Frame Section */}
        <div className="bg-gradient-to-br from-purple-950/40 to-slate-950/40 border border-purple-900/30 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              Frame
              <span className="text-sm text-purple-400 font-normal">
                Production Mode
              </span>
            </h2>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-900/30">
                    <th className="text-left py-4 px-4 text-purple-300 font-semibold text-sm w-8"></th>
                    <th className="text-left py-4 px-4 text-purple-300 font-semibold text-sm">
                      Name
                    </th>
                    <th className="text-left py-4 px-4 text-purple-300 font-semibold text-sm">
                      Port Num
                    </th>
                    <th className="text-left py-4 px-4 text-purple-300 font-semibold text-sm">
                      Total APIs
                    </th>
                    <th className="text-left py-4 px-4 text-purple-300 font-semibold text-sm">
                      Total Tests
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {repositories.map((repo, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-purple-900/10 hover:bg-purple-900/10 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <Circle className="w-4 h-4 text-purple-500" />
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-mono text-sm">
                          {repo.name}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-purple-300 font-mono text-sm">
                          {repo.port}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-purple-300 text-sm">
                          {repo.totalApis}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-purple-300 text-sm">
                          {repo.totalTests}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Route Repository Page Component
function RouteRepositoryPage({ sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState("");

  const routes = [
    { name: "UserSignal", port: "8743", totalTests: 24 },
    { name: "LoginLogic", port: "8743", totalTests: 18 },
    { name: "StoreStout", port: "8804", totalTests: 12 },
    { name: "Home", port: "7432", totalTests: 8 },
    { name: "Custom", port: "7743", totalTests: 6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <header className="border-b border-indigo-900/30 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Route Repository</h1>
            <button className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-full hover:scale-105 transition-transform shadow-lg shadow-lime-500/50">
              <Plus className="w-6 h-6 mx-auto text-black" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              placeholder="Search Routes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-indigo-950/30 border border-indigo-900/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-indigo-400/50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button className="px-6 py-4 bg-indigo-950/30 border border-indigo-900/50 rounded-xl text-white hover:bg-indigo-900/40 transition-all flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950/40 border border-indigo-900/30 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-full"></div>
              Frame
              <span className="text-sm text-indigo-400 font-normal">
                Production Mode
              </span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-indigo-900/30">
                    <th className="text-left py-4 px-4 text-indigo-300 font-semibold text-sm w-8"></th>
                    <th className="text-left py-4 px-4 text-indigo-300 font-semibold text-sm">
                      Route
                    </th>
                    <th className="text-left py-4 px-4 text-indigo-300 font-semibold text-sm">
                      Port Num
                    </th>
                    <th className="text-left py-4 px-4 text-indigo-300 font-semibold text-sm">
                      Total Tests
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-indigo-900/10 hover:bg-indigo-900/10 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <Circle className="w-4 h-4 text-indigo-500" />
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-mono text-sm">
                          {route.name}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-indigo-300 font-mono text-sm">
                          {route.port}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-indigo-300 text-sm">
                          {route.totalTests}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generated Tests Page Component
function GeneratedTestsPage({ sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const tests = [
    {
      id: 1,
      testCase: {
        username: "existinguser",
        password: "P@ssw0rd123",
      },
      expectedOutcome: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        user: {
          id: 1,
          username: "existinguser",
          email: "existinguser@example.com",
        },
      },
      difficulty: "Medium",
      type: "Positive",
    },
    {
      id: 2,
      testCase: {
        username: "invaliduser",
        password: "wrongpassword",
      },
      expectedOutcome: {
        error: "Invalid credentials",
        statusCode: 401,
      },
      difficulty: "Hard",
      type: "Negative",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Generated Tests</h1>
            <button className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-full hover:scale-105 transition-transform shadow-lg shadow-lime-500/50">
              <Plus className="w-6 h-6 mx-auto text-black" />
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search Tests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-purple-950/30 border border-purple-900/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-4 bg-purple-950/30 border border-purple-900/50 rounded-xl text-white hover:bg-purple-900/40 transition-all flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-purple-950/20 border border-purple-900/30 rounded-xl backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-purple-300 text-sm mb-2">
                  Difficulty
                </label>
                <select className="w-full bg-slate-950/50 border border-purple-900/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500">
                  <option>All</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-purple-300 text-sm mb-2">
                  Type
                </label>
                <select className="w-full bg-slate-950/50 border border-purple-900/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500">
                  <option>All</option>
                  <option>Positive</option>
                  <option>Negative</option>
                </select>
              </div>
              <div>
                <label className="block text-purple-300 text-sm mb-2">
                  Status
                </label>
                <select className="w-full bg-slate-950/50 border border-purple-900/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500">
                  <option>All</option>
                  <option>Passed</option>
                  <option>Failed</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tests Grid */}
        <div className="grid gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-gradient-to-br from-purple-950/40 to-slate-950/40 border border-purple-900/30 rounded-2xl overflow-hidden hover:border-purple-700/50 transition-all backdrop-blur-sm shadow-xl"
            >
              <div className="p-8">
                <div className="flex gap-8">
                  {/* Left Side - Test Data */}
                  <div className="flex-1 space-y-6">
                    {/* Test Case */}
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-purple-500 rounded"></div>
                        Test Case:
                      </h3>
                      <pre className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm overflow-x-auto font-mono">
                        {JSON.stringify(test.testCase, null, 2)}
                      </pre>
                    </div>

                    {/* Expected Outcome */}
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-green-500 rounded"></div>
                        Expected Outcome:
                      </h3>
                      <pre className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm overflow-x-auto font-mono max-h-48">
                        {JSON.stringify(test.expectedOutcome, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Right Side - Metadata and Actions */}
                  <div className="w-64 flex flex-col gap-4">
                    {/* Metadata Tags */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 text-sm">
                          Difficulty
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            test.difficulty === "Easy"
                              ? "bg-green-500/20 text-green-400"
                              : test.difficulty === "Medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {test.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 text-sm">Type</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            test.type === "Positive"
                              ? "bg-lime-500/20 text-lime-400"
                              : "bg-orange-500/20 text-orange-400"
                          }`}
                        >
                          {test.type}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 mt-auto">
                      <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-900/50 rounded-lg text-white transition-all flex items-center justify-center gap-2 group">
                        <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Edit Test Case
                      </button>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 group">
                        <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Run Test
                      </button>
                      <button className="w-full px-4 py-3 bg-lime-500/10 hover:bg-lime-500/20 border border-lime-500/30 rounded-lg text-lime-400 transition-all flex items-center justify-center gap-2 group">
                        <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Save Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tests.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-purple-950/30 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl text-white mb-2">No tests found</h3>
            <p className="text-purple-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("tests");

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content with padding for sidebar */}
      <div
        className={`transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-0"}`}
      >
        {currentPage === "tests" && (
          <GeneratedTestsPage sidebarOpen={sidebarOpen} />
        )}
        {currentPage === "repository" && (
          <RepositoryPage sidebarOpen={sidebarOpen} />
        )}
        {currentPage === "routes" && (
          <RouteRepositoryPage sidebarOpen={sidebarOpen} />
        )}
        {currentPage === "account" && (
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
            <div className="text-center">
              <User className="w-20 h-20 text-purple-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Account Page
              </h2>
              <p className="text-purple-400">Coming soon...</p>
            </div>
          </div>
        )}
        {currentPage === "settings" && (
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
            <div className="text-center">
              <Settings className="w-20 h-20 text-purple-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Settings Page
              </h2>
              <p className="text-purple-400">Coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
