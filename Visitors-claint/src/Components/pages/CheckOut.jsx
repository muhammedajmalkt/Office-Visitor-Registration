import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, LogOut } from "lucide-react";


import logoImage from '../../assets/logo.png';
import axiosInstance from '../../api/axiosInstance';


const CheckOut = () => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState(null);
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!mobile || mobile.length !== 10) {
    setError('Please enter a valid 10-digit mobile number');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const res = await axiosInstance.post("/visitors/checkout", { mobile });

    const data = res.data;
    setVisitorInfo(data.visitor);
    setSuccess(true);

    setTimeout(() => {
      setMobile('');
      setSuccess(false);
      setVisitorInfo(null);
    }, 5000);
  } catch (err) {
    console.error('Checkout error:', err);
    const errorMsg = err.response?.data?.message || 'Failed to check out';
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
};


  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-3 sm:p-6 flex items-center justify-center w-screen">
      <motion.div
        className="w-full max-w-md mx-auto bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className=" text-white p-5 flex flex-col items-center">
          <img src={logoImage} alt="Logo" className="h-20 mb-3 " />
          <h1 className="text-2xl sm:text-3xl font-bold text-center tracking-wide text-blue-900">YES INDIA FOUNDATION</h1>
          {/* <h2 className="text-xl sm:text-2xl font-bold text-center tracking-wide text-blue-900">Delhi Office</h2> */}
          <p className="text-base sm:text-lg font-medium text-gray-600">Visitor Check-Out</p>
        </div>

        {/* Success View */}
        {success && visitorInfo ? (
          <motion.div className="p-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogOut className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-3">Check-Out Successful!</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <div className="space-y-2 text-gray-700 text-sm">
                <p><span className="font-medium">Name:</span> {visitorInfo.name}</p>
                <p><span className="font-medium">Mobile:</span> {visitorInfo.mobile}</p>
                <p><span className="font-medium">Check-in:</span> {new Date(visitorInfo.check_in_time).toLocaleString()}</p>
                <p><span className="font-medium">Check-out:</span> {new Date(visitorInfo.check_out_time).toLocaleString()}</p>
                <p><span className="font-medium">Duration:</span> {visitorInfo.duration}</p>
              </div>
            </div>
            <p className="text-gray-600">Thank you for visiting!</p>
          </motion.div>
        ) : (
          // Form View
          <form onSubmit={handleSubmit} className="p-6">
            <p className="text-center text-gray-700 mb-6 font-medium">Enter your mobile number to check out</p>
            <div className="mb-4 py-5">
              <label className=" text-gray-700 font-medium mb-2 flex items-center">
                <Phone className="mr-2 text-blue-700" /> Mobile Number
              </label>
              <input
                type="tel"
                name='mobile'
                value={mobile}
                onChange={handleMobileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-black focus:ring-1 focus:ring-blue-800 shadow-sm text-lg"
                placeholder="Enter 10-digit mobile number"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <motion.div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center text-lg font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.95 }}
              disabled={loading || mobile.length !== 10}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <LogOut className="mr-2" /> Check Out
                </>
              )}
            </motion.button>
          </form>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-center bg-gray-50">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm">
            Need to Check In? Click here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckOut;
