import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; // 🔥 Import করা

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // যদি user already login থাকে
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const loadingToast = toast.loading("Logging in...");

  try {
    const res = await API.post("/users/login", form);
    
    console.log("✅ Login response:", res.data);
    
    // 🔥 Pass the entire response to login
    login(res.data);
    
    toast.success(`Welcome back, ${res.data.user?.username || 'User'}! 🎉`, {
      id: loadingToast,
    });
    
    navigate("/profile");
  } catch (err) {
    console.error("❌ Login error:", err);
    
    toast.error(
      err.response?.data?.message || "Login failed. Please check your credentials.",
      { id: loadingToast }
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          disabled={loading}
        />
        <button 
          className="bg-amber-400 text-white px-4 py-2 rounded w-full hover:bg-amber-400/80 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}



