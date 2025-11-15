"use client";

import { useState, useEffect } from "react";
import { X, Home } from "lucide-react";

const base_url = "http://127.0.0.1:8000";

/* ---------------------------------------------------
   Reusable Modal For Username / Email
---------------------------------------------------- */
function EditModal({ isOpen, onClose, onSave, title, value, setValue }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-purple-800/50 rounded-2xl shadow-xl w-full max-w-md p-8 m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-purple-950/30 border border-purple-900/50 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-900/50 rounded-lg text-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white shadow-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   Dedicated Modal For Password Change
---------------------------------------------------- */
function PasswordModal({
  isOpen,
  onClose,
  onSave,
  currPass,
  newPass,
  setCurrPass,
  setNewPass,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-purple-800/50 rounded-2xl shadow-xl w-full max-w-md p-8 m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Change Password</h3>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Current Password */}
        <input
          type="password"
          placeholder="Current Password"
          value={currPass}
          onChange={(e) => setCurrPass(e.target.value)}
          className="w-full bg-purple-950/30 border border-purple-900/50 rounded-lg px-4 py-3 text-white mb-4"
        />

        {/* New Password */}
        <input
          type="password"
          placeholder="New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="w-full bg-purple-950/30 border border-purple-900/50 rounded-lg px-4 py-3 text-white mb-6"
        />

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-900/50 rounded-lg text-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white shadow-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   MAIN ACCOUNT PAGE
---------------------------------------------------- */
export default function AccountPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Username/Email modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // Password modal
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  /* --------------------------- Load User --------------------------- */
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(`${base_url}/auth/me`, { headers: { token } });
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
        setEmail(data.email);
      }
    };
    load();
  }, []);

  /* ------------------------ Save Username/Email ------------------------ */
  const handleOpenModal = (field) => {
    setEditingField(field);
    setTempValue(field === "username" ? username : email);
    setIsModalOpen(true);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("userToken");
    const endpoint =
      editingField === "username" ? "/auth/me/username" : "/auth/me/email";

    const body =
      editingField === "username"
        ? { username: tempValue }
        : { email: tempValue };

    const res = await fetch(`${base_url}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      editingField === "username"
        ? setUsername(tempValue)
        : setEmail(tempValue);
    }

    setIsModalOpen(false);
  };

  /* ------------------------ Save Password ------------------------ */
  const handleSavePassword = async () => {
    setSavingPass(true);

    const token = localStorage.getItem("userToken");

    const res = await fetch(`${base_url}/auth/me/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({
        current_password: currPass,
        new_password: newPass,
      }),
    });

    setSavingPass(false);

    if (res.ok) {
      alert("Password changed successfully!");
      setIsPassModalOpen(false);
      setCurrPass("");
      setNewPass("");
    } else {
      const err = await res.json();
      alert("Error: " + err.detail);
    }
  };

  /* --------------------------------------------------------- */
  /*                          UI                               */
  /* --------------------------------------------------------- */

  return (
    <>
      {/* Username/Email Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveChanges}
        title={`Change ${editingField}`}
        value={tempValue}
        setValue={setTempValue}
      />

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        onSave={handleSavePassword}
        currPass={currPass}
        newPass={newPass}
        setCurrPass={setCurrPass}
        setNewPass={setNewPass}
        loading={savingPass}
      />

      {/* Main Page */}
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          <a
            href="./dashboard"
            className="flex items-center gap-2 text-purple-300 hover:text-white mb-4 transition-colors w-fit"
          >
            <Home size={20} />
            <span>Back to Dashboard</span>
          </a>
          <h1 className="text-3xl font-bold text-white mb-8">
            Account Settings
          </h1>

          <div className="space-y-10">
            {/* Username */}
            <Section
              label="Username"
              description="This is your public display name."
              value={username}
              onEdit={() => handleOpenModal("username")}
            />

            {/* Email */}
            <Section
              label="Email Address"
              description="Used for notifications and account management."
              value={email}
              onEdit={() => handleOpenModal("email")}
            />

            {/* Password */}
            <Section
              label="Password"
              description="Use a strong and unique password."
              isPassword
              onEdit={() => setIsPassModalOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------
   Section Component Cleaner UI
---------------------------------------------------- */
function Section({ label, description, value, onEdit, isPassword = false }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white pb-3 border-b border-purple-800/50">
        {label}
      </h2>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <p className="text-sm text-purple-300">{description}</p>
        </div>

        <div className="md:col-span-2 flex items-center gap-4">
          {!isPassword ? (
            <input
              type="text"
              disabled
              value={value}
              className="flex-grow bg-purple-950/30 border border-purple-900/50 rounded-lg px-4 py-3 text-white"
            />
          ) : (
            <p className="text-purple-300 italic">••••••••</p>
          )}

          <button
            onClick={onEdit}
            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-900/50 rounded-lg text-white"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
