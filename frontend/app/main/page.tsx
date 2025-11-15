"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Home,
  FolderGit2,
  User,
  Settings,
  X,
  Database,
  Mail,
  FileText,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function APITestGenerator() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id");

  // NEW: Added route field
  const [formData, setFormData] = useState({
    route: "",
    requestFormat: "",
    businessLogic: "",
    testCase: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // VALIDATION
  useEffect(() => {
    const { route, requestFormat, businessLogic } = formData;
    setIsFormValid(
      route.trim() !== "" &&
        requestFormat.trim() !== "" &&
        businessLogic.trim() !== "",
    );
  }, [formData]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // API
  async function generateTests(prompt: string) {
    const token = localStorage.getItem("userToken");
    if (!token) throw new Error("Not logged in");

    const res = await fetch("http://localhost:8000/api/generate-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate tests");
    }

    return res.json();
  }

  const handleGenerateTests = async () => {
    if (!isFormValid) return;

    setIsLoading(true);

    const inputToLLM = {
      route: formData.route,
      requestFormat: formData.requestFormat,
      businessLogic: formData.businessLogic,
      testCase: formData.testCase || "",
      project_id: projectId,
    };

    try {
      const tests = await generateTests(JSON.stringify(inputToLLM));
      localStorage.setItem("tests", JSON.stringify(tests));
      router.push(`./results?project_id=${projectId}`);
    } catch (err) {
      alert("Error generating tests");
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-60" : "w-0"
        } backdrop-blur-xl bg-white/5 border-r border-white/10 transition-all overflow-hidden relative z-10`}
      >
        <div className="p-6 relative">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-8 text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-lg border border-white/10"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  item.active
                    ? "bg-purple-500/30 text-white border border-purple-400/30"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex justify-center items-center relative px-8">
        <div className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl relative z-10">
          <div className="space-y-6">
            {/* NEW FIELD — ROUTE NAME */}
            <input
              name="route"
              value={formData.route}
              onChange={handleInputChange}
              placeholder="Enter the route name (e.g. /login, /products)"
              className="w-full px-6 py-4 bg-white/10 text-white rounded-xl placeholder-gray-400 border border-white/20"
            />

            {/* REQUEST FORMAT */}
            <textarea
              name="requestFormat"
              value={formData.requestFormat}
              onChange={handleInputChange}
              placeholder={`Enter request format e.g.\nusername: string\npassword: string`}
              rows={3}
              className="w-full px-6 py-4 bg-white/10 text-white rounded-xl border border-white/20 resize-none"
            />

            {/* BUSINESS LOGIC */}
            <textarea
              name="businessLogic"
              value={formData.businessLogic}
              onChange={handleInputChange}
              placeholder="Describe the business logic"
              rows={3}
              className="w-full px-6 py-4 bg-white/10 text-white rounded-xl border border-white/20 resize-none"
            />

            {/* OPTIONAL EXAMPLE TEST */}
            <textarea
              name="testCase"
              value={formData.testCase}
              onChange={handleInputChange}
              placeholder="Enter example test case (optional)"
              rows={2}
              className="w-full px-6 py-4 bg-white/10 text-white rounded-xl border border-white/20 resize-none"
            />

            {/* Generate Tests Button */}
            <div className="flex justify-end">
              <button
                disabled={!isFormValid || isLoading}
                onClick={handleGenerateTests}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:scale-105 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? "Generating..." : "Generate Tests →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
