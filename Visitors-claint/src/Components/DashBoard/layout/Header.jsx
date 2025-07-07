import { Bell, Menu, User } from "lucide-react";

const Header = ({ setSidebarOpen, notificationCount, userEmail }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between lg:py-9">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium text-white bg-red-600 rounded-full">
              {notificationCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">{userEmail}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;