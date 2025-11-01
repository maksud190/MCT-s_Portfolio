import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; // 🔥 Import করা

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
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

    // 🔥 Loading toast
    const loadingToast = toast.loading("Creating your account...");

    try {
      await API.post("/users/register", form);
      
      // 🔥 Success toast
      toast.success("Registration successful! Please login 🎉", {
        id: loadingToast,
        duration: 4000,
      });
      
      // Form reset
      setForm({ username: "", email: "", password: "" });
      
      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err) {
      console.error("Registration error:", err);
      
      // 🔥 Error toast
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again.",
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
          Register
        </h2>
        
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          disabled={loading}
        />
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
          minLength={6}
        />
        <button 
          className="bg-amber-400 text-white px-4 py-2 rounded w-full hover:bg-amber-400/80 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}