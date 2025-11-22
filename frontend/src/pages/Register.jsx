import { useState, useEffect } from "react";
import { API } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    designation: "",
    department: "Multimedia and Creative Technology",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  useEffect(() => {
    const calculateStrength = () => {
      let strength = 0;
      if (form.password.length >= 6) strength += 25;
      if (form.password.length >= 8) strength += 25;
      if (/[a-z]/.test(form.password) && /[A-Z]/.test(form.password))
        strength += 25;
      if (/[0-9]/.test(form.password)) strength += 25;
      setPasswordStrength(strength);
    };
    calculateStrength();
  }, [form.password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const designationOptions = {
    teacher: [
      "Professor",
      "Associate Professor",
      "Assistant Professor",
      "Senior Lecturer",
      "Lecturer",
      "Instructor",
      "Lab Instructor",
      "Teaching Assistant",
    ],
    student: [
      "Undergraduate Student",
      "Graduate Student",
      "Final Year Student",
      "Research Assistant",
      "Teaching Assistant",
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await API.post("/users/register", form);

      toast.success("Registration successful! Please login 🎉", {
        autoClose: 4000,
      });

      setForm({
        username: "",
        email: "",
        password: "",
        role: "student",
        designation: "",
        department: "Multimedia and Creative Technology",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-4 md:mt-6 text-3xl md:text-4xl font-extrabold text-stone-100">
            Join Us Today!
          </h2>
          <p className="mt-2 text-xs md:text-sm text-stone-300">
            Create your account and start showcasing your work
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 md:mt-8 space-y-4 md:space-y-6">
          <div className="bg-stone-900/50 rounded-sm p-6 md:p-8 space-y-4 md:space-y-6 border border-stone-700">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs md:text-sm font-medium text-stone-200 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 md:h-5 md:w-5 text-stone-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-700 text-stone-200 focus:border-transparent transition-all"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs md:text-sm font-medium text-stone-200 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 md:h-5 md:w-5 text-stone-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-700 text-stone-200 focus:border-transparent transition-all"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-xs md:text-sm font-medium text-stone-200 mb-2"
              >
                I am a
              </label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => {
                  setForm({ ...form, role: e.target.value, designation: "" });
                }}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-700 text-stone-200 focus:border-transparent transition-all"
                required
                disabled={loading}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher/Instructor</option>
              </select>
            </div>

            {/* Designation Selection */}
            <div>
              <label
                htmlFor="designation"
                className="block text-xs md:text-sm font-medium text-stone-200 mb-2"
              >
                Designation
              </label>
              <select
                id="designation"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-700 text-stone-200 focus:border-transparent transition-all"
                required
                disabled={loading}
              >
                <option value="">Select designation</option>
                {designationOptions[form.role].map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-xs md:text-sm font-medium text-stone-200 mb-2"
              >
                Department
              </label>
              <input
                id="department"
                type="text"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-700 text-stone-200 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs md:text-sm font-medium text-stone-200 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 md:h-5 md:w-5 text-stone-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full pl-9 md:pl-10 pr-10 md:pr-12 py-2 md:py-3 text-sm md:text-base border border-stone-600 rounded-sm bg-stone-700 text-white focus:border-transparent transition-all"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Password strength:
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        passwordStrength <= 50
                          ? "text-orange-500"
                          : "text-green-500"
                      }`}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-stone-900 text-stone-100 py-2 md:py-3 px-4 rounded-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm md:text-base font-bold"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 md:h-5 md:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-stone-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-amber-500 hover:text-amber-400 dark:text-amber-400 dark:hover:text-amber-400/80 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-32 h-32 md:w-40 md:h-40 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}