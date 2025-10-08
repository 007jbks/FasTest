"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Circle,
  Edit3,
  Trash2,
  Play,
  Save,
} from "lucide-react";

// Repository Page Component
function RepositoryPage() {
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
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-purple-900/20 rounded-lg transition-colors">
                <div className="w-6 h-6 flex flex-col justify-center gap-1">
                  <div className="h-0.5 bg-white rounded"></div>
                  <div className="h-0.5 bg-white rounded"></div>
                  <div className="h-0.5 bg-white rounded"></div>
                </div>
              </button>
              <h1 className="text-3xl font-bold text-white">Repository</h1>
            </div>
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
function RouteRepositoryPage() {
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
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-indigo-900/20 rounded-lg transition-colors">
                <div className="w-6 h-6 flex flex-col justify-center gap-1">
                  <div className="h-0.5 bg-white rounded"></div>
                  <div className="h-0.5 bg-white rounded"></div>
                  <div className="h-0.5 bg-white rounded"></div>
                </div>
              </button>
              <h1 className="text-3xl font-bold text-white">
                Route Repository
              </h1>
            </div>
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

// Test Library Page Component
function TestLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const tests = [
    {
      testCase: {
        username: "testinguser",
        password: "TestingXYZ1",
      },
      expectedOutcome: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
        user: {
          id: 1,
          username: "testinguser",
          email: "testinguser@example.com",
        },
      },
      difficulty: "Medium",
      type: "Positive",
      status: "Passed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <header className="border-b border-blue-900/30 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-blue-900/20 rounded-lg transition-colors">
                <div className="w-6 h-6 flex flex-col justify-center gap-1">
                  <div className="h-0.5 bg-white rounded"></div>
                  <div className="h-0.5 bg-white rounded"></div>
                  <div className="h-0.5 bg-white rounded"></div>
                </div>
              </button>
              <h1 className="text-3xl font-bold text-white">Test Library</h1>
            </div>
            <button className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-full hover:scale-105 transition-transform shadow-lg shadow-lime-500/50">
              <Plus className="w-6 h-6 mx-auto text-black" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="text"
              placeholder="Search Tests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-blue-950/30 border border-blue-900/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button className="px-6 py-4 bg-blue-950/30 border border-blue-900/50 rounded-xl text-white hover:bg-blue-900/40 transition-all flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="grid gap-6">
          {tests.map((test, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-blue-950/40 to-slate-950/40 border border-blue-900/30 rounded-2xl overflow-hidden hover:border-blue-700/50 transition-all backdrop-blur-sm shadow-xl "
            >
              <div className="p-8">
                <div className="flex gap-8 ">
                  <div className="flex-1 space-y-6 w-1/4">
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-blue-500 rounded"></div>
                        Test Case:
                      </h3>
                      <pre className="bg-black/40 border border-blue-900/30 rounded-xl p-4 text-blue-200 text-sm overflow-x-auto font-mono">
                        {JSON.stringify(test.testCase, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-green-500 rounded"></div>
                        Expected Outcome:
                      </h3>
                      <pre className="bg-black/40 border border-blue-900/30 rounded-xl p-4 text-blue-200 text-sm overflow-x-auto font-mono max-h-48">
                        {JSON.stringify(test.expectedOutcome, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="w-64 flex flex-col gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 text-sm">
                          Difficulty
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                          {test.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 text-sm">Type</span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-lime-500/20 text-lime-400">
                          {test.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 text-sm">Status</span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                          {test.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <button className="w-full px-4 py-3 bg-white/90 hover:bg-white border border-blue-900/50 rounded-lg text-slate-900 font-semibold transition-all">
                        Run New Test
                      </button>
                      <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-blue-900/50 rounded-lg text-white transition-all flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Get Test
                      </button>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-white font-semibold transition-all shadow-lg shadow-blue-500/30">
                        Update Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main App Component with Navigation
export default function App() {
  const [currentPage, setCurrentPage] = useState("repository");

  return (
    <div className="min-h-screen">
      {/* Page Selector - for demo purposes */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full p-1 flex gap-1">
        <button
          onClick={() => setCurrentPage("repository")}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
            currentPage === "repository"
              ? "bg-purple-600 text-white"
              : "text-white/70 hover:text-white"
          }`}
        >
          Repository
        </button>
        <button
          onClick={() => setCurrentPage("routes")}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
            currentPage === "routes"
              ? "bg-indigo-600 text-white"
              : "text-white/70 hover:text-white"
          }`}
        >
          Route Repository
        </button>
        <button
          onClick={() => setCurrentPage("tests")}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
            currentPage === "tests"
              ? "bg-blue-600 text-white"
              : "text-white/70 hover:text-white"
          }`}
        >
          Test Library
        </button>
      </div>

      {/* Render Current Page */}
      <div className="pt-16">
        {currentPage === "repository" && <RepositoryPage />}
        {currentPage === "routes" && <RouteRepositoryPage />}
        {currentPage === "tests" && <TestLibraryPage />}
      </div>
    </div>
  );
}
