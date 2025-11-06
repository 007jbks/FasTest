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
  Search,
  ChevronLeft,
  Filter,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";

const mockTests = [
  {
    id: 1,
    name: "Get all products successfully",
    type: "Positive",
    status: "Passed",
    lastRun: "1 hour ago",
    request: {
      method: "GET",
      url: "/api/products",
      headers: { "Content-Type": "application/json" },
      body: null,
    },
    response: {
      statusCode: 200,
      body: [
        { id: 1, name: "Laptop" },
        { id: 2, name: "Smartphone" },
      ],
    },
  },
  {
    id: 2,
    name: "Return 404 for non-existent product",
    type: "Negative",
    status: "Passed",
    lastRun: "1 hour ago",
    request: {
      method: "GET",
      url: "/api/products/999",
      headers: { "Content-Type": "application/json" },
      body: null,
    },
    response: {
      statusCode: 404,
      body: { error: "Product not found" },
    },
  },
  {
    id: 3,
    name: "Handle invalid query parameters",
    type: "Negative",
    status: "Failed",
    lastRun: "1 hour ago",
    request: {
      method: "GET",
      url: "/api/products?sort=invalid",
      headers: { "Content-Type": "application/json" },
      body: null,
    },
    response: {
      statusCode: 400,
      body: { error: "Invalid sort parameter" },
    },
  },
  {
    id: 4,
    name: "Check product schema integrity",
    type: "Positive",
    status: "Passed",
    lastRun: "2 hours ago",
    request: {
      method: "GET",
      url: "/api/products/1",
      headers: { "Content-Type": "application/json" },
      body: null,
    },
    response: {
      statusCode: 200,
      body: { id: 1, name: "Laptop", price: 1200 },
    },
  },
  {
    id: 5,
    name: "Paginate products correctly",
    type: "Positive",
    status: "Passed",
    lastRun: "2 hours ago",
    request: {
      method: "GET",
      url: "/api/products?page=2&limit=1",
      headers: { "Content-Type": "application/json" },
      body: null,
    },
    response: {
      statusCode: 200,
      body: [{ id: 2, name: "Smartphone" }],
    },
  },
];

function TestDetailModal({ test, onClose }) {
  if (!test) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-950/50 border border-purple-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{test.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Request</h3>
            <pre className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm font-mono">
              {JSON.stringify(test.request, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Response</h3>
            <pre className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm font-mono">
              {JSON.stringify(test.response, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditTestModal({ test, onClose, onSave }) {
  const [editedTest, setEditedTest] = useState(test);

  if (!test) return null;

  const handleSave = () => {
    onSave(editedTest);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-950/50 border border-purple-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Test</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6">
          <div>
            <label className="text-white font-semibold mb-2 block">
              Test Name
            </label>
            <input
              type="text"
              value={editedTest.name}
              onChange={(e) =>
                setEditedTest({ ...editedTest, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Request</h3>
            <textarea
              value={JSON.stringify(editedTest.request, null, 2)}
              onChange={(e) =>
                setEditedTest({
                  ...editedTest,
                  request: JSON.parse(e.target.value),
                })
              }
              className="w-full h-48 bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm font-mono"
            />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Response</h3>
            <textarea
              value={JSON.stringify(editedTest.response, null, 2)}
              onChange={(e) =>
                setEditedTest({
                  ...editedTest,
                  response: JSON.parse(e.target.value),
                })
              }
              className="w-full h-48 bg-black/40 border border-purple-900/30 rounded-xl p-4 text-purple-200 text-sm font-mono"
            />
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RouteTests() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [editingTest, setEditingTest] = useState(null);
  const [tests, setTests] = useState(mockTests);

  const handleDelete = (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      setTests(tests.filter((test) => test.id !== testId));
    }
  };

  const handleSave = (updatedTest) => {
    setTests(
      tests.map((test) => (test.id === updatedTest.id ? updatedTest : test)),
    );
  };

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
    <>
      <TestDetailModal
        test={selectedTest}
        onClose={() => setSelectedTest(null)}
      />
      {editingTest && (
        <EditTestModal
          test={editingTest}
          onClose={() => setEditingTest(null)}
          onSave={handleSave}
        />
      )}
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
                href="/routes"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-2"
              >
                <ChevronLeft size={20} />
                Back to Routes
              </a>
              <h1 className="text-4xl font-bold tracking-wider">
                Tests for /api/products
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/main"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
              >
                <PlusCircle size={20} />
                <span>Generate Test</span>
              </a>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300">
                <PlusCircle size={20} />
                <span>Add Manual Test</span>
              </button>
            </div>
          </header>

          <div className="space-y-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-between"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setSelectedTest(test)}
                >
                  <h2 className="text-xl font-semibold mb-2">{test.name}</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        test.type === "Positive"
                          ? "bg-sky-500/20 text-sky-300"
                          : "bg-orange-500/20 text-orange-300"
                      }`}
                    >
                      {test.type}
                    </span>
                    <span
                      className={`font-semibold ${
                        test.status === "Passed"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {test.status}
                    </span>
                    <span className="text-gray-400">
                      Last run: {test.lastRun}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTest(test);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(test.id);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 font-medium rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
