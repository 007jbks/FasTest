"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  Home,
  Database,
  User,
  Settings,
  X,
  ChevronLeft,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

export default function RouteTests() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  const [editingTest, setEditingTest] = useState(null);
  const [editText, setEditText] = useState("");
  const [saveState, setSaveState] = useState("idle");

  const [projectId, setProjectId] = useState(null);
  const [routeId, setRouteId] = useState(null);
  const [running, setRunning] = useState({});

  /* --------------------- LOAD PROJECT + ROUTE IDs --------------------- */
  useEffect(() => {
    setProjectId(Number(localStorage.getItem("selectedProjectId")));
    setRouteId(Number(localStorage.getItem("selectedRouteId")));
  }, []);

  /* --------------------- LOAD TEST STATUS --------------------- */
  async function loadStatus(testId) {
    const token = localStorage.getItem("userToken");
    if (!token) return "Not Run";

    try {
      const res = await fetch(`${API_BASE_URL}/api/test-status/${testId}`, {
        headers: { token },
      });

      if (!res.ok) return "Not Run";

      const data = await res.json();

      if (!data.has_run) return "Not Run";
      return data.passed ? "Passed" : "Failed";
    } catch {
      return "Not Run";
    }
  }

  /* --------------------- LOAD TESTS --------------------- */
  useEffect(() => {
    if (!projectId || !routeId) return;

    const loadTests = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/routes/${routeId}/tests`, {
        headers: { token },
      });

      if (!res.ok) return;

      const data = await res.json();

      let mapped = data.tests.map((t) => {
        const raw = t.body || {};
        return {
          id: t.id,
          name: raw.test_name || "Untitled Test",
          rawBody: raw,
          status: "Loading...",
        };
      });

      setTests(mapped);

      const updated = await Promise.all(
        mapped.map(async (t) => ({
          ...t,
          status: await loadStatus(t.id),
        })),
      );

      setTests(updated);
    };

    loadTests();
  }, [projectId, routeId]);

  /* ------------------ RUN TEST ------------------ */
  async function runTest(testId) {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    setRunning((prev) => ({ ...prev, [testId]: true }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/run-test/${testId}`, {
        method: "POST",
        headers: { token },
      });

      const data = await res.json();

      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? { ...t, status: data.passed ? "Passed" : "Failed" }
            : t,
        ),
      );
    } catch {}

    setRunning((prev) => ({ ...prev, [testId]: false }));
  }

  /* ------------------ DELETE TEST ------------------ */
  async function handleDelete(testId) {
    if (!confirm("Delete this test?")) return;

    const token = localStorage.getItem("userToken");

    await fetch(`${API_BASE_URL}/api/tests/${testId}`, {
      method: "DELETE",
      headers: { token },
    });

    setTests((prev) => prev.filter((t) => t.id !== testId));
  }

  /* ------------------ SAVE EDIT ------------------ */
  async function handleSave() {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    let parsed;
    try {
      parsed = JSON.parse(editText);
    } catch {
      alert("JSON invalid. Fix it before saving.");
      return;
    }

    setSaveState("saving");

    const res = await fetch(`${API_BASE_URL}/api/tests/${editingTest.id}`, {
      method: "PUT",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: parsed }),
    });

    if (!res.ok) {
      alert("Update failed");
      setSaveState("idle");
      return;
    }

    setTests((prev) =>
      prev.map((t) =>
        t.id === editingTest.id
          ? { ...t, rawBody: parsed, name: parsed.test_name || t.name }
          : t,
      ),
    );

    setSaveState("saved");

    setTimeout(() => {
      setSaveState("idle");
      setEditingTest(null);
    }, 800);
  }

  /* ------------------ NAV ------------------ */
  const navItems = [
    { icon: Home, label: "Home", link: "/dashboard" },
    { icon: Database, label: "Repository", link: "/repository", active: true },
    { icon: User, label: "Account", link: "/account" },
  ];

  return (
    <>
      {/* EDIT MODAL */}
      {editingTest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-purple-700/50 rounded-xl w-[700px] p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">Edit Test</h2>
              <button
                onClick={() => setEditingTest(null)}
                className="text-white"
              >
                <X size={24} />
              </button>
            </div>

            <textarea
              className="w-full h-72 bg-black/40 border border-purple-900/30 p-4 rounded-xl text-sm"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />

            <button
              className="mt-4 px-6 py-2 bg-purple-600 rounded-lg"
              onClick={handleSave}
            >
              {saveState === "saving"
                ? "Saving..."
                : saveState === "saved"
                  ? "Saved!"
                  : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl w-[700px] border border-purple-700/40">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold">{selectedTest.name}</h2>
              <button onClick={() => setSelectedTest(null)}>
                <X size={24} />
              </button>
            </div>

            <h3 className="mt-4 mb-2 text-lg font-semibold">
              Request / Test Body
            </h3>
            <pre className="bg-black/40 p-4 rounded-xl overflow-auto">
              {JSON.stringify(selectedTest.rawBody, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <div className="flex h-screen text-white bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        {/* SIDEBAR */}
        <div className="w-60 bg-white/5 border-r border-white/10 transition-all">
          <div className="p-6">
            <nav className="space-y-2 mt-8">
              {navItems.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  className="flex items-center gap-3 p-3"
                >
                  <item.icon />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <button
                onClick={() => {
                  const pid = localStorage.getItem("selectedProjectId");
                  window.location.href = pid
                    ? `/routes?project_id=${pid}`
                    : "/repository";
                }}
                className="flex items-center gap-2 text-gray-300 hover:text-white mb-2"
              >
                <ChevronLeft size={20} />
                Back to Routes
              </button>

              <h1 className="text-4xl font-bold tracking-wider">Tests</h1>
            </div>

            <div className="flex gap-4">
              <a
                href="/main"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center gap-2"
              >
                <PlusCircle />
                Generate Test
              </a>

              {/* ADD CUSTOM TEST BUTTON */}
              <a
                href="/test"
                className="px-6 py-3 bg-blue-500 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition"
              >
                <PlusCircle />
                Add Custom Test
              </a>
            </div>
          </header>

          {/* TEST LIST */}
          <div className="space-y-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className="p-5 bg-white/10 border border-white/20 rounded-xl flex justify-between items-center"
              >
                <div
                  onClick={() => setSelectedTest(test)}
                  className="cursor-pointer"
                >
                  <h2 className="text-xl font-bold">{test.name}</h2>
                </div>

                <div className="flex items-center gap-5">
                  <button
                    className="px-4 py-2 bg-purple-600 rounded-lg"
                    onClick={() => runTest(test.id)}
                    disabled={running[test.id]}
                  >
                    {running[test.id] ? "Running..." : "Run"}
                  </button>

                  <span
                    className={`font-bold ${
                      test.status === "Passed"
                        ? "text-green-400"
                        : test.status === "Failed"
                          ? "text-red-400"
                          : "text-gray-400"
                    }`}
                  >
                    {test.status}
                  </span>

                  <button
                    className="px-3 py-2 bg-white/10 rounded-lg"
                    onClick={() => {
                      setEditingTest(JSON.parse(JSON.stringify(test)));
                      setEditText(JSON.stringify(test.rawBody, null, 2));
                    }}
                  >
                    <Edit size={16} /> Edit
                  </button>

                  <button
                    className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg"
                    onClick={() => handleDelete(test.id)}
                  >
                    <Trash2 size={16} /> Delete
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
