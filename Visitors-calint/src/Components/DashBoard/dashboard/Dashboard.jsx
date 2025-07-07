import { format } from "date-fns";
import { motion } from "framer-motion";
import { Users, UserCheck, UserMinus, Calendar, Clock, FileText, ChevronDown, UserCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart, BarChart, Bar } from "recharts";

const Dashboard = ({ 
  stats, 
  visitorTrend, 
  visitorsByPurpose, 
  activeVisitors, 
  setActiveView,
  handleVisitorClick,
  handleManualCheckout,
  fetchVisitors
}) => {
  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#10B981"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Last updated:</span>
          <span className="text-sm font-medium text-gray-900">{format(new Date(), "MMM dd, yyyy h:mm a")}</span>
          <button
            onClick={fetchVisitors}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: "Total Visitors",
            value: stats.total,
            icon: Users,
            color: "indigo",
            trend: "12% increase",
            trendColor: "green",
          },
          {
            title: "Currently Checked In",
            value: stats.checkedIn,
            icon: UserCheck,
            color: "green",
            trend: "5% increase",
            trendColor: "green",
          },
          {
            title: "Checked Out",
            value: stats.checkedOut,
            icon: UserMinus,
            color: "purple",
            trend: "Total completed visits",
            trendColor: "gray",
          },
          {
            title: "Today's Visitors",
            value: stats.today,
            icon: Calendar,
            color: "yellow",
            trend: "Active today",
            trendColor: "yellow",
            trendIcon: Clock,
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                <p className={`text-xs mt-2 flex items-center text-${stat.trendColor}-600`}>
                  {stat.trendIcon ? <stat.trendIcon className="h-3 w-3 mr-1" /> : (
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                  <span>{stat.trend}</span>
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full bg-${stat.color}-50 flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Visitor Trend</h3>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorTrend}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#6366F1"
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Visitors by Purpose</h3>
            <button 
              onClick={() => setActiveView("reports")}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <FileText className="h-4 w-4 mr-1" />
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
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {visitorsByPurpose.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} visitors`, name]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ paddingLeft: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 italic">No purpose data available</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Active Visitors Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Currently Checked In</h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {activeVisitors.length} Active
              </span>
              <button 
                onClick={() => setActiveView("visitors")}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md flex items-center"
              >
                <Users className="h-3 w-3 mr-1" />
                View All Visitors
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Visitor", "Mobile", "Check-In Time", "Purpose", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider "
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeVisitors.length > 0 ? (
                activeVisitors.map((visitor) => {
                  const checkInTime = visitor.checkInTime;
                  const now = new Date();
                  const diffMs = now - checkInTime;
                  const diffH  = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  // const duration = diffH > 0 ? `${diffH}h ${diffMins}m` : `${diffMins}m`;

                  return (
                    <tr key={visitor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap  ">
                        <div className="flex items-center ">
                          {visitor.imageUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={visitor.imageUrl}
                              alt={visitor.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <UserCircle className="h-5 w-5 text-indigo-600" />
                            </div>
                          )}
                          <div className="ml-4 ">
             <div className="text- font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer " onClick={() => handleVisitorClick(visitor._id)} >
              {visitor.name}
            </div>
                            <div className="text-xs text-gray-500">
                              {visitor.idType?.toUpperCase() || 'N/A'}: {visitor.idNumber || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{visitor.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap  text-center">
                        <div className="text-sm text-gray-900">
                          {visitor.checkInTime ? format(visitor.checkInTime, "MMM dd, h:mm a") : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap  text-center">
                        <span className="px-2.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                          {visitor.purpose || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap  ">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleManualCheckout(visitor._id)}
                            className="text-xs px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded"
                          >
                            Check-out
                          </button>
                          <button
                            onClick={() => handleVisitorClick(visitor._id)}
                            className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded"
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
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No active visitors
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setActiveView("visitors")}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <ChevronDown className="h-4 w-4 mr-1" /> View all visitor records
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;