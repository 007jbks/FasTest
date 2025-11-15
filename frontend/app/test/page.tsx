"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Home,
  Database,
  User,
  Settings,
  X,
  Mail,
  FileText,
  ChevronLeft,
  Save,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

export default function ManualTestCreation() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [projectId, setProjectId] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [testName, setTestName] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [responseBody, setResponseBody] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* --------------------------- AUTH + LOAD PROJECT --------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return router.replace("/login");

    const pid = localStorage.getItem("selectedProjectId");
    if (!pid) return router.replace("/repository");

    setProjectId(Number(pid));
  }, []);

  /* --------------------------- LOAD ROUTES --------------------------- */
  useEffect(() => {
    if (!projectId) return;

    const loadRoutes = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/routes`,
        {
          headers: { token },
        },
      );

      if (!res.ok) return;

      const data = await res.json();
      setRoutes(data.routes || []);
    };

    loadRoutes();
  }, [projectId]);

  /* ------------------------------ SAVE TEST ------------------------------ */
  const handleSave = async () => {
    if (!testName || !requestBody || !responseBody || !selectedRoute)
      return alert("Fill all fields and select a route.");

    let parsedReq, parsedRes;

    try {
      parsedReq = JSON.parse(requestBody);
      parsedRes = JSON.parse(responseBody);
    } catch {
      return alert("Invalid JSON in request or response body.");
    }

    const token = localStorage.getItem("userToken");
    if (!token) return router.replace("/login");

    const finalTestBody = {
      test_name: testName,
      request_method: parsedReq.method || "GET",
      request_headers: parsedReq.headers || {},
      request_body: parsedReq.body || {},
      expected_status_code: parsedRes.status || 200,
      expected_response_body: parsedRes.body || parsedRes,
    };

    const payload = {
      tests: [
        {
          route: selectedRoute.routename,
          method: selectedRoute.method,
          body: finalTestBody,
        },
      ],
      project_id: projectId,
    };

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/save-tests`, {
        method: "POST",
        headers: { token, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.log(await res.text());
        return alert("Saving failed");
      }

      setSaved(true);
      setTimeout(() => router.push("/tests"), 700);
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------ NAV ------------------------------ */
  const navItems = [
    { icon: Home, label: "Home", link: "/dashboard" },
    { icon: Database, label: "Repository", link: "/repository", active: true },
    { icon: User, label: "Account", link: "/account" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* SIDEBAR */}
      <div className="w-60 bg-white/5 border-r border-white/10">
        <div className="p-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-6 text-gray-300 hover:text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="space-y-2 mt-4">
            {navItems.map((item, i) => (
              <a
                key={i}
                href={item.link}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  item.active
                    ? "bg-purple-500/30 border border-purple-300/30"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => router.push("/tests")}
              className="flex items-center gap-2 text-gray-300 hover:text-white mb-2"
            >
              <ChevronLeft size={20} />
              Back to Tests
            </button>
            <h1 className="text-4xl font-bold">Create Manual Test</h1>
          </div>
        </header>

        {/* FORM */}
        <div className="bg-white/10 p-8 rounded-2xl border border-white/20 space-y-6">
          {/* ROUTE SELECT */}
          <div>
            <label className="text-white mb-2 block">Select Route</label>
            <select
              className="w-full bg-black/30 border border-purple-700 p-3 rounded-xl"
              value={selectedRoute ? String(selectedRoute.id) : ""}
              onChange={(e) =>
                setSelectedRoute(
                  routes.find((r) => String(r.id) === e.target.value),
                )
              }
            >
              <option value="">-- Select Route --</option>
              {routes.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.method} → {r.routename}
                </option>
              ))}
            </select>
          </div>

          {/* TEST NAME */}
          <div>
            <label className="text-white mb-2 block">Test Name</label>
            <input
              className="w-full p-3 bg-black/30 border border-purple-700 rounded-xl"
              placeholder="e.g., Validate user fetch"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>

          {/* REQUEST BODY */}
          <div>
            <label className="text-white mb-2 block">Request Body JSON</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full h-48 bg-black/40 border border-purple-700 p-4 rounded-xl font-mono text-sm"
            />
          </div>

          {/* RESPONSE BODY */}
          <div>
            <label className="text-white mb-2 block">
              Expected Response JSON
            </label>
            <textarea
              value={responseBody}
              onChange={(e) => setResponseBody(e.target.value)}
              className="w-full h-48 bg-black/40 border border-purple-700 p-4 rounded-xl font-mono text-sm"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.push("/tests")}
              className="px-6 py-3 bg-white/10 rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 ${
                saved
                  ? "bg-green-600"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              }`}
            >
              <Save size={20} />
              {saving ? "Saving…" : saved ? "Saved!" : "Save Test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
