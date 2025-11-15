"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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

const base_url = "http://localhost:8000";

export default function ProjectRoutes() {
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

  const searchParams = useSearchParams();

  const projectId = searchParams.get("project_id");

  const [routes, setRoutes] = useState([]);
  const [projectName, setProjectName] = useState("Project");
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [editData, setEditData] = useState({
    routename: "",
    method: "GET",
  });

  const [runningAll, setRunningAll] = useState({});

  /** ========================================================================
   * FETCH ROUTES + FETCH ROUTE PASS STATS
   * ===================================================================== */
  useEffect(() => {
    if (!projectId) return;

    const token = localStorage.getItem("userToken");
    if (!token) return;

    const fetchRoutes = async () => {
      setLoading(true);

      try {
        // Fetch project name
        const p = await fetch(`${base_url}/api/projects/${projectId}`, {
          headers: { token },
        });

        if (p.ok) {
          const pdata = await p.json();
          setProjectName(pdata.projectName);
        }

        // Fetch raw routes
        const res = await fetch(
          `${base_url}/api/projects/${projectId}/routes`,
          { headers: { token } },
        );

        let routesList = [];
        if (res.ok) {
          const data = await res.json();
          routesList = data.routes || [];
        }

        // Fetch pass stats
        const stats = await fetch(
          `${base_url}/api/routes-passed-stats/${projectId}`,
          { headers: { token } },
        ).then((r) => r.json());

        // map stats by route_id
        const statsMap = {};
        stats.routes.forEach((r) => {
          statsMap[r.route_id] = r;
        });

        // merge stats into routes
        const enhanced = routesList.map((r) => ({
          ...r,
          passPercentage: Number((statsMap[r.id]?.percentage || 0).toFixed(2)),
          totalTests: statsMap[r.id]?.total_tests || 0,
        }));

        setRoutes(enhanced);
      } catch (err) {
        console.error("Error fetching routes:", err);
      }

      setLoading(false);
    };

    fetchRoutes();
  }, [projectId]);

  /** ========================================================================
   * RUN ALL TESTS → THEN RELOAD PASS STATS
   * ===================================================================== */
  async function runAllTests(routeId) {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    setRunningAll((prev) => ({ ...prev, [routeId]: true }));

    try {
      // Run tests
      await fetch(`${base_url}/api/run-tests/${projectId}/${routeId}`, {
        method: "POST",
        headers: { token },
      });

      // Fetch updated stats
      const stats = await fetch(
        `${base_url}/api/routes-passed-stats/${projectId}`,
        { headers: { token } },
      ).then((r) => r.json());

      const statsMap = {};
      stats.routes.forEach((r) => {
        statsMap[r.route_id] = r;
      });

      // Update UI with new pass % and test count
      setRoutes((prev) =>
        prev.map((r) => ({
          ...r,
          passPercentage: Number((statsMap[r.id]?.percentage || 0).toFixed(2)),
          totalTests: statsMap[r.id]?.total_tests || r.totalTests,
        })),
      );
    } catch (err) {
      console.error("Run all tests error:", err);
    }

    setRunningAll((prev) => ({ ...prev, [routeId]: false }));
  }

  /** ========================================================================
   * EDIT ROUTE
   * ===================================================================== */
  const openEditModal = (route) => {
    setSelectedRoute(route);
    setEditData({
      routename: route.routename,
      method: route.method || "GET",
    });
    setEditModal(true);
  };

  const saveRouteEdits = async () => {
    if (!selectedRoute) return;

    const token = localStorage.getItem("userToken");

    const body = {
      routename: editData.routename,
      method: editData.method,
    };

    try {
      const res = await fetch(`${base_url}/api/routes/${selectedRoute.id}`, {
        method: "PUT",
        headers: {
          token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        // Reload routes fully
        const updated = await fetch(
          `${base_url}/api/projects/${projectId}/routes`,
          { headers: { token } },
        ).then((r) => r.json());

        setRoutes(updated.routes || []);
        setEditModal(false);
      }
    } catch (err) {
      console.error("Error updating route:", err);
    }
  };

  /** ========================================================================
   * DELETE ROUTE
   * ===================================================================== */
  const deleteRoute = async () => {
    if (!selectedRoute) return;

    const token = localStorage.getItem("userToken");

    try {
      const res = await fetch(`${base_url}/api/routes/${selectedRoute.id}`, {
        method: "DELETE",
        headers: { token },
      });

      if (res.ok) {
        setRoutes(routes.filter((r) => r.id !== selectedRoute.id));
        setDeleteModal(false);
      }
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  /** ========================================================================
   * NAV BAR ITEMS
   * ===================================================================== */
  const navItems = [
    { icon: Home, label: "Home", link: "/dashboard" },
    { icon: Database, label: "Repository", active: true, link: "/repository" },
    { icon: User, label: "Account", link: "/account" },
  ];

  /** ========================================================================
   * UI RENDER
   * ===================================================================== */
  return (
    <div
      key={projectId}
      className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden"
    >
      {/* SIDEBAR */}
      <div className="w-60 backdrop-blur-xl bg-white/5 border-r border-white/10 transition-all duration-300">
        <div className="p-6">
          <nav className="space-y-2 mt-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  item.active
                    ? "bg-purple-500/30 border border-purple-300/30"
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
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <a
              href="/repository"
              className="flex items-center gap-2 text-gray-300 hover:text-white mb-2"
            >
              <ChevronLeft size={20} />
              Back to Repository
            </a>
            <h1 className="text-4xl font-bold">{projectName} — Routes</h1>
          </div>
        </header>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <h2 className="text-2xl">Loading routes...</h2>
          </div>
        )}

        {/* NO ROUTES */}
        {!loading && routes.length === 0 && (
          <div className="flex flex-col items-center h-64">
            <h2 className="text-2xl mb-4">No Routes Found</h2>
            <Link href="/main">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <PlusCircle size={22} /> Create Tests
              </button>
            </Link>
          </div>
        )}

        {/* ROUTE LIST */}
        {!loading && routes.length > 0 && (
          <div className="space-y-4">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-white/10 border border-white/20 rounded-xl p-6 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-mono">{route.routename}</h2>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-gray-400 text-sm">Total Tests</p>
                    <p className="text-2xl font-bold">{route.totalTests}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Pass Rate</p>
                    <p
                      className={`text-2xl font-bold ${
                        route.passPercentage > 90
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {Number(route.passPercentage).toFixed(2)}%
                    </p>
                  </div>

                  <button
                    className="px-6 py-3 bg-white/10"
                    onClick={() => {
                      localStorage.setItem("selectedRouteId", route.id);
                      router.push("/tests");
                    }}
                  >
                    View Tests
                  </button>

                  <button
                    className="px-6 py-3 bg-purple-600 rounded-lg"
                    onClick={() => runAllTests(route.id)}
                    disabled={runningAll[route.id]}
                  >
                    {runningAll[route.id] ? "Running..." : "Run All"}
                  </button>

                  <button
                    onClick={() => openEditModal(route)}
                    className="p-3 bg-white/10 rounded-lg"
                  >
                    <Edit size={20} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRoute(route);
                      setDeleteModal(true);
                    }}
                    className="p-3 bg-red-500/20 rounded-lg text-red-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit Route</h2>

            <input
              className="w-full p-2 mb-3 bg-white/10 border border-white/20"
              value={editData.routename}
              onChange={(e) =>
                setEditData({ ...editData, routename: e.target.value })
              }
            />

            <select
              className="w-full p-2 mb-6 bg-white/10 border border-white/20"
              value={editData.method}
              onChange={(e) =>
                setEditData({ ...editData, method: e.target.value })
              }
            >
              {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-white/10 rounded"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-500 rounded"
                onClick={saveRouteEdits}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-xl w-80">
            <h2 className="text-xl font-bold mb-4">Delete Route?</h2>
            <p className="text-gray-300 mb-4">
              This will permanently delete this route and its tests.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-white/10 rounded"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-500 rounded"
                onClick={deleteRoute}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
