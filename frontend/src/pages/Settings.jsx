import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Settings page coming soon...
        </p>
        <button
          onClick={() => navigate("/profile")}
          className="mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}