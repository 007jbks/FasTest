"use client";
import { useRouter } from "next/navigation";
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

const base_url = "http://127.0.0.1:8000";

export default function CreateProject() {
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
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    businessLogic: "",
    projectUrl: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { projectName, businessLogic, projectUrl } = formData;
    setIsFormValid(
      projectName.trim() !== "" &&
        businessLogic.trim() !== "" &&
        projectUrl.trim() !== "",
    );
  }, [formData]);

  const navItems = [
    { icon: Home, label: "Home", active: false, link: "./dashboard" },
    {
      icon: Database,
      label: "Repository",
      active: true,
      link: "./repository",
    },
    { icon: User, label: "Account", active: false, link: "./account" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestConnection = async () => {
    console.log("Testing connection for:", formData.projectUrl);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${base_url}/api/test-connection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: formData.projectUrl }),
      });

      if (response.ok) {
        alert("Connection successful!");
      } else {
        const errorData = await response.json();
        alert(`Connection failed: ${response.status} - ${errorData.detail}`);
      }
    } catch (error) {
      alert(`Connection failed: ${error}`);
    }
  };

  const handleCreateProject = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    console.log("Creating project with:", formData);

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`${base_url}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const project = await response.json();
        console.log("Project created:", project);
        alert("Project created successfully!");
        // Redirect to the project page or dashboard
        router.push("/dashboard");
      } else {
        alert(
          `Project creation failed: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      alert(`Project creation failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="w-60 backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out relative z-10">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-blue-500/5 pointer-events-none"></div>

        <div className="p-6 relative">
          <nav className="space-y-2 mt-8">
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

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Form Container - Glassmorphic */}
        <div className="flex items-center justify-center h-full px-8 relative z-10">
          <div className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl relative">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <div className="space-y-6 relative">
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Enter the name of the project"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white/15 transition-all duration-300 hover:border-white/30"
              />

              <textarea
                name="businessLogic"
                value={formData.businessLogic}
                onChange={handleInputChange}
                placeholder="Describe the business logic of the project"
                rows="3"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white/15 transition-all duration-300 hover:border-white/30 resize-none"
              />

              <input
                type="text"
                name="projectUrl"
                value={formData.projectUrl}
                onChange={handleInputChange}
                placeholder="Enter the URL of the project"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white/15 transition-all duration-300 hover:border-white/30"
              />

              {/* Buttons */}
              <div className="flex justify-end pt-6 gap-4">
                <button
                  onClick={handleTestConnection}
                  className="px-8 py-3 bg-gray-500/50 text-white font-medium rounded-xl hover:bg-gray-500/70 transition-all duration-300 flex items-center gap-2"
                >
                  Test Connection
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!isFormValid || isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Project"}
                  {!isLoading && <span>→</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
