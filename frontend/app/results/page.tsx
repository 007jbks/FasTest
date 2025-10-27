"use client";

import { useState, useEffect } from "react";
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

const base_url = "http://127.0.0.1:8000";

// Sidebar Component
function Sidebar({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) {
  const navItems = [
    { icon: Home, label: "Generated Tests", page: "tests" },
    { icon: User, label: "Account", page: "account" },
    { icon: Settings, label: "Settings", page: "settings" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${
          sidebarOpen ? "w-60" : "w-0"
        } backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out overflow-hidden z-40`}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-blue-500/5 pointer-events-none"></div>

        <div className="p-6 relative">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 text-gray-300 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20"
          >
            <X size={24} />
          </button>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(item.page)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  currentPage === item.page
                    ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-400/30 backdrop-blur-sm shadow-lg shadow-purple-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                }`}
              >
                <item.icon
                  size={20}
                  className={`${
                    currentPage === item.page
                      ? "text-purple-300"
                      : "group-hover:text-purple-300 transition-colors"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
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

      {/* Toggle Button for Closed Sidebar */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 text-gray-300 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-lg backdrop-blur-xl border border-white/20"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
}

// Generated Tests Page Component
function GeneratedTestsPage({ sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        console.log("Attempting to fetch tests...");
        const token = localStorage.getItem("userToken");
        if (!token) {
          console.error("Authentication token not found. Please log in.");
          return;
        }

        const response = await fetch(`${base_url}/history/`, {
          headers: {
            token: token,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `API request failed with status ${response.status}: ${errorText}`,
          );
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Successfully fetched tests:", data);

        const formattedTests = data.map((item) => {
          const body = JSON.parse(item.body);
          return {
            id: item.id,
            testCase: body.test_case,
            expectedOutcome: body.expected_response,
            difficulty: "Medium", // Placeholder
            type:
              body.expected_response.status_code === 200
                ? "Positive"
                : "Negative",
          };
        });
        setTests(formattedTests);
      } catch (error) {
        console.error("An error occurred while fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
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
                  <div className="flex-1 w-1/2 space-y-6">
                    {/* Test Case */}
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2 overflow-x-auto">
                        <div className="w-1 h-5 bg-purple-500 rounded"></div>
                        Test Case:
                      </h3>
                      <pre className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm overflow-x-scroll overflow-y-scroll font-mono">
                        {JSON.stringify(test.testCase, null, 2)}
                      </pre>
                    </div>

                    {/* Expected Outcome */}
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2 overflow-x-auto">
                        <div className="w-1 h-5 bg-green-500 rounded "></div>
                        Expected Outcome:
                      </h3>
                      <pre className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm overflow-x-auto font-mono max-h-48">
                        {JSON.stringify(test.expectedOutcome, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Right Side - Metadata and Actions */}
                  <div className="w-1/3 flex flex-col gap-4 overflow-x-auto ">
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
