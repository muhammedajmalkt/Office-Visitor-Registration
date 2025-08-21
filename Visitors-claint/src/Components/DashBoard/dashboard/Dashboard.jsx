import { format } from "date-fns";
import { motion } from "framer-motion";
import { Users, UserCheck, UserMinus, Calendar, Clock, FileText, ChevronDown, UserCircle, RefreshCw, } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart, } from "recharts";

const Dashboard = ({
  stats,
  visitorTrend,
  visitorsByPurpose,
  activeVisitors,
  setActiveView,
  handleVisitorClick,
  handleManualCheckout,
  fetchVisitors,
  trendFilter,
  setTrendFilter,
}) => {
  const COLORS = [ "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444", ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const trendOptions = [
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
    { value: "quarter", label: "Last 90 days" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:p-6"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
        >
          <div className="p-4 lg:p-0">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Dashboard Overview
            </h2>
            <p className="text-slate-600 mt-2">
              Monitor and manage your visitor flow in real-time
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-10 backdrop-blur-sm rounded-xl">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">Last updated:</span>
              <span className="text-sm font-semibold text-slate-900">
                {format(new Date(), "MMM dd, h:mm a")}
              </span>
            </div>
            <button
              onClick={fetchVisitors}
              className="p-3 backdrop-blur-sm hover:bg-white/90 rounded-xl border border-white/20 shadow-sm transition-all duration-200 hover:shadow-md group"
            >
              <RefreshCw className="h-5 w-5 text-slate-600 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: "Total Visitors",
              value: stats.total,
              icon: Users,
              gradient: "from-blue-500 to-blue-600",
              bgGradient: "from-blue-50 to-blue-100",
              trend: "12% increase",
              trendColor: "text-emerald-600",
            },
            {
              title: "Currently Checked In",
              value: stats.checkedIn,
              icon: UserCheck,
              gradient: "from-emerald-500 to-emerald-600",
              bgGradient: "from-emerald-50 to-emerald-100",
              trend: "5% increase",
              trendColor: "text-emerald-600",
            },
            {
              title: "Checked Out",
              value: stats.checkedOut,
              icon: UserMinus,
              gradient: "from-purple-500 to-purple-600",
              bgGradient: "from-purple-50 to-purple-100",
              trend: "Total completed visits",
              trendColor: "text-slate-600",
            },
            {
              title: "Today's Visitors",
              value: stats.today,
              icon: Calendar,
              gradient: "from-amber-500 to-amber-600",
              bgGradient: "from-amber-50 to-amber-100",
              trend: "Active today",
              trendColor: "text-amber-600",
              trendIcon: Clock,
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">
                    {stat.value}
                  </h3>
                  <div className={`flex items-center gap-1 ${stat.trendColor}`}>
                    {stat.trendIcon ? (
                      <stat.trendIcon className="h-3 w-3" />
                    ) : (
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    )}
                    <span className="text-xs font-medium">{stat.trend}</span>
                  </div>
                </div>
                <div
                  className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-center`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <stat.icon
                    className={`h-7 w-7 bg-gradient-to-br ${stat.gradient} bg-clip-text text-gray-300`}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Visitor Trend
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Track visitor patterns over time
                </p>
              </div>
              <select
                value={trendFilter}
                onChange={(e) => setTrendFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              >
                {trendOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorTrend}>
                  <defs>
                    <linearGradient
                      id="colorVisitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                      backgroundColor: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Visitors by Purpose
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Breakdown of visit categories
                </p>
              </div>
              <button
                onClick={() => setActiveView("reports")}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <FileText className="h-4 w-4" />
                View Reports
              </button>
            </div>
            <div className="h-80 flex items-center justify-center">
              {visitorsByPurpose.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visitorsByPurpose}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {visitorsByPurpose.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} visitors`, name]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                        backgroundColor: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: "20px", fontSize: "14px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 italic">
                    No purpose data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <div className="p-8 border-b border-slate-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Currently Checked In
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Active visitors in the building
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 text-sm font-semibold">
                    {activeVisitors.length} Active
                  </span>
                </div>
                <button
                  onClick={() => setActiveView("visitors")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <Users className="h-4 w-4" />
                  View All Visitors
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  {[
                    "Visitor",
                    "Mobile",
                    "Check-In Time",
                    "Purpose",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {activeVisitors.length > 0 ? (
                  activeVisitors.map((visitor) => {
                    const checkInTime = visitor.checkInTime;
                    const now = new Date();
                    const diffMs = now - new Date(checkInTime);
                    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffMins = Math.floor(
                      (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                    );

                    return (
                      <tr
                        key={visitor._id}
                        className="hover:bg-slate-50/50 transition-colors duration-200 group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            {visitor.imageUrl ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                src={visitor.imageUrl || "/placeholder.svg"}
                                alt={visitor.name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-2 ring-white shadow-sm">
                                <UserCircle className="h-6 w-6 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <div
                                className="text-base font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200"
                                onClick={() => handleVisitorClick(visitor._id)}
                              >
                                {visitor.name}
                              </div>
                              <div className="text-sm text-slate-500 mt-1">
                                {visitor.idType?.toUpperCase() || "N/A"}:{" "}
                                {visitor.idNumber || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-medium text-slate-900">
                            {visitor.mobile}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-medium text-slate-900">
                            {visitor.checkInTime
                              ? format(new Date(visitor.checkInTime), "MMM dd, h:mm a")
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                            {visitor.purpose || "N/A"}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleManualCheckout(visitor._id)}
                              className="px-4 py-2 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 rounded-lg border border-red-200 transition-all duration-200 hover:shadow-sm"
                            >
                              Check-out
                            </button>
                            <button
                              onClick={() => handleVisitorClick(visitor._id)}
                              className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-sm"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium">
                            No active visitors
                          </p>
                          <p className="text-slate-400 text-sm mt-1">
                            All visitors have checked out
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50/30 border-t border-slate-200/50">
            <button
              onClick={() => setActiveView("visitors")}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <ChevronDown className="h-4 w-4" />
              View all visitor records
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;