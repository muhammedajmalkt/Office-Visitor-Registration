import { Bell, Menu, User } from "lucide-react"

const Header = ({ setSidebarOpen, notificationCount, userEmail }) => {
  return (
    <header className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 backdrop-blur-sm border-b border-white/20 shadow-lg shadow-blue-100/50 p-6 flex items-center justify-between ">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-white/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md lg:hidden border border-white/30"
        >
          <Menu className="h-5 w-5" />
        </button>

      </div>

      <div className="flex items-center space-x-2">
        <div className="relative group">
          <button className="p-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-white/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md border ">
            <Bell className="h-5 w-5" />
          </button>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2.5  border border-white/30 hover:shadow-md transition-all duration-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-medium text-slate-800 leading-tight">{userEmail}</span>
            <div className="text-xs text-slate-500">Online</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
