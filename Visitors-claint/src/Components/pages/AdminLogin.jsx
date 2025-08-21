import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axiosInstance.post("/admin/login", { email, password });
      console.log("Login success:", res.data);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center w-screen">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        </div>
      </div>{" "}

      <motion.div
        className="w-full max-w-md bg-blue-50/90 rounded-xl shadow-lg overflow-hidden z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-slate-800 to-indigo-800 text-white p-6 text-center">
          <h2 className="text-3xl font-bold">Admin Login</h2>
          <p className="text-blue-100 mt-1">Visitor Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className=" text-gray-700 text-sm font-medium mb-2 flex items-center">
              <User className="mr-2 text-indigo-600" size={18} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 border border-gray-400 text-black rounded-md focus:outline-none focus:ring-1 focus:ring-blue-800"
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password with toggle */}
          <div>
            <label className=" text-gray-700 text-sm font-medium mb-2 flex items-center">
              <Lock className="mr-2 text-indigo-600" size={18} /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-400 text-black rounded-md focus:outline-none focus:ring-1 focus:ring-blue-800 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1.5 text-gray-500 hover:text-gray-700  "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-800 to-slate-800  hover:from-indigo-700 text-white rounded-lg flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </motion.button>

          <div className="text-center text-sm text-gray-500">
            <a href="/" className="text-indigo-800 hover:underline ">
              Return to Check-In Page
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
