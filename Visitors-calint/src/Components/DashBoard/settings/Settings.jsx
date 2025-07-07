import { motion } from "framer-motion";

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
        <p className="text-gray-600">Settings content will go here...</p>
      </div>
    </motion.div>
  );
};

export default Settings;