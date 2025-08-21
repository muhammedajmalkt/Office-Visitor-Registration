import { motion } from "framer-motion";
import { LogOut, Home, Users, BarChart2, Settings, X } from "lucide-react";
import mainLogo from "../../../assets/logo.png";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeView,
  setActiveView,
  handleSignOut,
}) => {
  return (
    <>
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden "
        />
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed inset-y-0 left-0 z-50 w-72 lg:static lg:z-auto"
      >
        <div className="h-full bg-gradient-to-br from-slate-100 via-white/90 to-gray-50/95 backdrop-blur-xl border-r border-white/20 shadow-xl  ">
          <div className="flex items-center justify-between p-6 border-b border-gradient-to-r from-transparent via-gray-200/50 to-transparent">
            <div className="flex items-center space-x-2">
              <img src={mainLogo} alt="Logo" className="h-16 w-auto" />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all duration-200 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-6 space-y-2">
            {[
              { name: "Dashboard", icon: Home, view: "dashboard" },
              { name: "Visitors", icon: Users, view: "visitors" },
              { name: "Reports", icon: BarChart2, view: "reports" },
              { name: "Settings", icon: Settings, view: "settings" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveView(item.view)}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  activeView === item.view
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 transition-transform duration-200 ${
                    activeView === item.view
                      ? "scale-110"
                      : "group-hover:scale-105"
                  }`}
                />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gradient-to-r from-transparent via-gray-200/50 to-transparent">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-105" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
