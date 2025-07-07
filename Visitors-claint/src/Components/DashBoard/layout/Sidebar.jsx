import { motion } from "framer-motion";
import { LogOut, Home, Users, BarChart2, Settings, X } from "lucide-react";
import mainLogo from "../../../assets/logo.png";
import {  useNavigate } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeView, setActiveView, handleSignOut }) => {
    const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: sidebarOpen ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:z-auto"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 " onClick={()=>navigate("/admin")}>
        <div className="flex items-center space-x-2">
          <img src={mainLogo} alt="Logo" className="h-16 w-auto"  />
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {[
          { name: "Dashboard", icon: Home, view: "dashboard" },
          { name: "Visitors", icon: Users, view: "visitors" },
          { name: "Reports", icon: BarChart2, view: "reports" },
          { name: "Settings", icon: Settings, view: "settings" },
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.view)}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
              activeView === item.view
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 w-[250px] p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md  border-none!"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;