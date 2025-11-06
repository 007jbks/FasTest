"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const base_url = "http://127.0.0.1:8000";

// Modal Component
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
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-purple-950/30 border border-purple-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 mb-6"
            autoFocus
          />
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-900/50 rounded-lg text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all shadow-lg shadow-purple-500/30"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null); // 'username' or 'email'
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        console.error("No token found");
        // Handle redirect to login or show an error
        return;
      }
      try {
        const response = await fetch(`${base_url}/auth/me`, {
          headers: { token },
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setEmail(data.email);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleOpenModal = (field) => {
    setEditingField(field);
    setTempValue(field === "username" ? username : email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      console.error("Authentication token not found.");
      return;
    }

    const endpoint =
      editingField === "username" ? "/auth/me/username" : "/auth/me/email";
    const body =
      editingField === "username"
        ? { username: tempValue }
        : { email: tempValue };

    try {
      const response = await fetch(`${base_url}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        if (editingField === "username") {
          setUsername(tempValue);
        } else if (editingField === "email") {
          setEmail(tempValue);
        }
        console.log(`${editingField} updated successfully`);
      } else {
        const errorData = await response.json();
        console.error(`Failed to update ${editingField}:`, errorData.detail);
      }
    } catch (error) {
      console.error(`An error occurred while updating ${editingField}:`, error);
    }

    handleCloseModal();
  };

  return (
    <>
      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
        title={`Change ${editingField}`}
        value={tempValue}
        setValue={setTempValue}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-white mb-8">
            Account Settings
          </h1>

          <div className="space-y-10">
            {/* Username Section */}
            <div>
              <h2 className="text-xl font-semibold text-white pb-3 border-b border-purple-800/50">
                Username
              </h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <p className="text-sm text-purple-300">
                    This is your public display name. It can be your real name
                    or a pseudonym.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      id="username"
                      value={username}
                      disabled
                      className="flex-grow w-full bg-purple-950/30 border border-purple-900/50 rounded-lg px-4 py-3 text-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleOpenModal("username")}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-900/50 rounded-lg text-white font-semibold transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Section */}
            <div>
              <h2 className="text-xl font-semibold text-white pb-3 border-b border-purple-800/50">
                Email Address
              </h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <p className="text-sm text-purple-300">
                    Your primary email address is used for notifications and
                    account management.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-4">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      disabled
                      className="flex-grow w-full bg-purple-950/30 border border-purple-900/50 rounded-lg px-4 py-3 text-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleOpenModal("email")}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-900/50 rounded-lg text-white font-semibold transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h2 className="text-xl font-semibold text-white pb-3 border-b border-purple-800/50">
                Password
              </h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <p className="text-sm text-purple-300">
                    It's a good idea to use a strong password that you're not
                    using elsewhere.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={() => alert("Password change coming soon!")}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-purple-900/50 rounded-lg text-white font-semibold transition-colors"
                  >
                    Change password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
