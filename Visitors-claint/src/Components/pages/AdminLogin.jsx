import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock } from 'lucide-react'; 
import axiosInstance from '../../api/axiosInstance';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center w-screen">
      <motion.div
        className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-blue-100 mt-1">Visitor Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className=" text-gray-700 text-sm font-medium mb-2 flex items-center">
              <User className="mr-2 text-blue-600" size={18} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className=" text-gray-700 text-sm font-medium mb-2 flex items-center">
              <Lock className="mr-2 text-blue-600" size={18} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300  text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : 'Login'}
          </motion.button>

          <div className="text-center text-sm text-gray-500">
            <a href="/" className="text-blue-600 hover:underline">
              Return to Check-In Page
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
