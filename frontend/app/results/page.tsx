"use client";

import { useState, useEffect } from "react";
import { Search, Edit3, Save, Home } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

/* ---------------- AUTH TOKEN ---------------- */
async function getAuthToken() {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("Not logged in");
  return token;
}

/* ---------------- BACKEND CALLS ---------------- */
async function saveTests(tests, projectId) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/api/save-tests`, {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: JSON.stringify({ tests, project_id: projectId }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function updateTest(testId, data) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/api/tests/${testId}`, {
    method: "PUT",
    headers: { token, "Content-Type": "application/json" },
    body: JSON.stringify({ test: data }),
  });

  if (!res.ok) throw new Error("Failed to update test");
  return res.json();
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function GeneratedTestsPage() {
  const [tests, setTests] = useState([]);
  const [editing, setEditing] = useState({ id: null, content: "" });

  const [savingOne, setSavingOne] = useState(null);
  const [savingAll, setSavingAll] = useState(false);

  const [savedOne, setSavedOne] = useState(null);
  const [savedAll, setSavedAll] = useState(false);

  const [search, setSearch] = useState("");
  const [projectId, setProjectId] = useState(null);

  /* ------------ LOAD PROJECT ID ------------ */
  useEffect(() => {
    const saved = localStorage.getItem("selectedProjectId");
    if (saved) setProjectId(Number(saved));
  }, []);

  /* ------------ LOAD TESTS FROM LOCAL STORAGE ------------ */
  useEffect(() => {
    const raw = localStorage.getItem("tests");
    if (!raw) return;

    const arr = JSON.parse(raw);

    const formatted = arr.map((item, idx) => {
      const b = item.body;

      return {
        id: b.test_name || `test-${idx}`,
        name: b.test_name || `Test ${idx + 1}`,
        route: item.route,
        method: item.method,
        testCase: {
          method: b.request_method,
          headers: b.request_headers,
          body: b.request_body,
        },
        expected: {
          status_code: b.expected_status_code,
          body: b.expected_response_body,
        },
        original: item,
        dbId: item.test_id || null,
      };
    });

    setTests(formatted);
  }, []);

  /* ------------ FIXED normalize() ------------ */
  function normalize(test) {
    return {
      route: test.route || test.original.route || "default",
      method: test.method || test.testCase.method || "GET",
      body: test.original.body,
    };
  }

  /* ------------ SAVE ONE ------------ */
  async function handleSave(test) {
    if (!projectId) return alert("Project ID missing");

    setSavingOne(test.id);

    try {
      await saveTests([normalize(test)], projectId);

      setSavedOne(test.id);
      setTimeout(() => setSavedOne(null), 1500);
    } catch {
      alert("Save failed");
    }

    setSavingOne(null);
  }

  /* ------------ SAVE ALL ------------ */
  async function handleSaveAll() {
    if (!projectId) return alert("Project ID missing");

    setSavingAll(true);

    try {
      await saveTests(tests.map(normalize), projectId);

      setSavedAll(true);
      setTimeout(() => setSavedAll(false), 1500);
    } catch {
      alert("Saving all failed");
    }

    setSavingAll(false);
  }

  /* ------------ SAVE EDIT ------------ */
  async function handleSaveEdit(id) {
    try {
      const parsed = JSON.parse(editing.content);

      const t = tests.find((x) => x.id === id);
      if (!t) return;

      /* Update backend IF test exists in DB */
      if (t.dbId) {
        await updateTest(t.dbId, parsed);
      }

      /* Update UI only */
      const updated = tests.map((x) =>
        x.id === id
          ? {
              ...x,
              testCase: {
                method: parsed.request_method,
                headers: parsed.request_headers,
                body: parsed.request_body,
              },
              expected: {
                status_code: parsed.expected_status_code,
                body: parsed.expected_response_body,
              },
              original: { ...x.original, body: parsed },
            }
          : x,
      );

      setTests(updated);

      // ❌ MUST NOT WRITE TO LOCALSTORAGE
      // localStorage.setItem("tests", ... );  <-- removed

      setEditing({ id: null, content: "" });
      alert("Updated!");
    } catch {
      alert("Invalid JSON");
    }
  }

  const filtered = tests.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-10 text-white">
      <div className="flex justify-between items-center mb-10">
        <a href="/dashboard" className="bg-purple-600 px-4 py-2 rounded-lg">
          <Home size={20} />
        </a>
        <h1 className="text-4xl font-bold">Generated Tests</h1>
      </div>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
        <input
          className="w-full bg-purple-950/30 border border-purple-900/50 rounded-xl pl-12 pr-4 py-4"
          placeholder="Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <button
        onClick={handleSaveAll}
        className="mb-8 bg-green-600 px-6 py-3 rounded-lg"
      >
        {savingAll ? "Saving…" : savedAll ? "Saved!" : "Save All Tests"}
      </button>

      <div className="space-y-6">
        {filtered.map((test) => {
          const isEditing = editing.id === test.id;

          return (
            <div
              key={test.id}
              className="bg-black/30 rounded-2xl border border-purple-800 p-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {test.name}{" "}
                  <span className="text-purple-300">({test.route})</span>
                </h2>

                <button
                  onClick={() => handleSave(test)}
                  disabled={savingOne === test.id}
                  className="bg-lime-600 px-4 py-2 rounded-lg"
                >
                  {savingOne === test.id
                    ? "Saving…"
                    : savedOne === test.id
                      ? "Saved!"
                      : "Save"}
                </button>

                <button
                  onClick={() =>
                    setEditing({
                      id: test.id,
                      content: JSON.stringify(test.original.body, null, 2),
                    })
                  }
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
              </div>

              {isEditing ? (
                <>
                  <textarea
                    className="w-full h-48 bg-black/60 border border-purple-700 p-4 rounded-lg"
                    value={editing.content}
                    onChange={(e) =>
                      setEditing({ ...editing, content: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleSaveEdit(test.id)}
                    className="mt-4 bg-green-600 px-6 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <pre className="bg-black/40 p-4 rounded-lg mb-4">
                  {JSON.stringify(test.original.body, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
