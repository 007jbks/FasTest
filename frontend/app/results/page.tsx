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
  const [allTests, setAllTests] = useState([]);
  const [tests, setTests] = useState([]);
  const [savedTests, setSavedTests] = useState(new Set());
  const [editingTest, setEditingTest] = useState({ id: null, content: "" });

  const handleEditClick = (test) => {
    setEditingTest({
      id: test.id,
      content: JSON.stringify(test.testCase, null, 2),
    });
  };

  const handleSaveEdit = (testId) => {
    try {
      const updatedTestCase = JSON.parse(editingTest.content);
      const updatedTests = allTests.map((test) =>
        test.id === testId ? { ...test, testCase: updatedTestCase } : test,
      );
      setAllTests(updatedTests);
      setEditingTest({ id: null, content: "" });
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  };

  const handleSaveTest = async (testToSave) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      console.error("Authentication token not found.");
      return;
    }

    // The backend expects the original test format, not the formatted one.
    const fullTestObject = allTests.find((t) => t.id === testToSave.id);
    if (!fullTestObject || !fullTestObject.originalTest) {
      console.error("Could not find original test data to save.");
      return;
    }

    try {
      const response = await fetch(`${base_url}/api/save-tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ tests: [fullTestObject.originalTest] }),
      });

      if (response.ok) {
        console.log("Test saved successfully:", testToSave.name);
        setSavedTests((prev) => new Set(prev).add(testToSave.id));
      } else {
        const errorData = await response.json();
        console.error("Failed to save test:", errorData.detail);
        // You might want to show an error to the user here
      }
    } catch (error) {
      console.error("An error occurred while saving the test:", error);
    }
  };

  useEffect(() => {
    const loadTests = () => {
      try {
        console.log("Attempting to load tests from storage...");
        const storedTests = localStorage.getItem("tests");
        if (!storedTests) {
          console.log("No tests found in local storage.");
          setAllTests([]);
          return;
        }

        const data = JSON.parse(storedTests);
        console.log("Successfully loaded tests:", data);

        const formattedTests = data.map((item, index) => {
          return {
            id: item.test_name || index,
            name: item.test_name || `Test ${index + 1}`,
            testCase: item.request_body,
            expectedOutcome: {
              status_code: item.expected_status_code,
              body: item.expected_response_body,
            },
            difficulty: "Medium",
            type:
              item.expected_status_code >= 200 &&
              item.expected_status_code < 300
                ? "Positive"
                : "Negative",
            originalTest: item, // Keep original test data
          };
        });
        setAllTests(formattedTests);
      } catch (error) {
        console.error("An error occurred while loading tests:", error);
        setAllTests([]); // Clear tests on error
      }
    };

    loadTests();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = allTests.filter((test) => {
      return test.name.toLowerCase().includes(lowercasedQuery);
    });
    setTests(filtered);
  }, [searchQuery, allTests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Home size={20} />
            </a>
            <h1 className="text-3xl font-bold text-white">Generated Tests</h1>
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
        </div>

        {/* Tests Grid */}
        <div className="grid gap-6">
          {tests.map((test) => {
            const isSaved = savedTests.has(test.id);
            const isEditing = editingTest.id === test.id;
            return (
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
                        {isEditing ? (
                          <textarea
                            value={editingTest.content}
                            onChange={(e) =>
                              setEditingTest({
                                ...editingTest,
                                content: e.target.value,
                              })
                            }
                            className="w-full h-48 bg-black/40 border border-purple-700 rounded-xl p-4 text-purple-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <pre className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm overflow-x-scroll overflow-y-scroll font-mono">
                            {JSON.stringify(test.testCase, null, 2)}
                          </pre>
                        )}
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
                        <div>
                          <h3 className="text-purple-400 text-sm mb-2">
                            Test Name
                          </h3>
                          <p className="text-white font-semibold">
                            {test.name}
                          </p>
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
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(test.id)}
                            className="w-full px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-all flex items-center justify-center gap-2 group"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(test)}
                            className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-900/50 rounded-lg text-white transition-all flex items-center justify-center gap-2 group"
                          >
                            <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Edit Test Case
                          </button>
                        )}
                        <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 group">
                          <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Run Test
                        </button>
                        <button
                          onClick={() => handleSaveTest(test)}
                          disabled={isSaved}
                          className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 group ${
                            isSaved
                              ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                              : "bg-lime-500/10 hover:bg-lime-500/20 border border-lime-500/30 text-lime-400"
                          }`}
                        >
                          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          {isSaved ? "Saved" : "Save Test"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
      <div className={`transition-all duration-300`}>
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
