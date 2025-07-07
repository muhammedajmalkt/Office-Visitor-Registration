import { motion } from "framer-motion";
import { Search, Filter, Calendar, Download, Printer, ChevronDown, RefreshCcw } from "lucide-react";
import VisitorRecord from "./VisitorRecord";

const Visitors = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
  filteredVisitors,
  handleExportToCsv,
  handlePrint,
  handleVisitorClick,
  handleManualCheckout,
  handleUpdateId,
  fetchVisitors
}) => {
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
      {/* Visitors Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Visitor Records</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search visitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg  text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button
            onClick={fetchVisitors}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            title="Refresh"
          > <RefreshCcw />
          </button>
        </div>
      </div>

      {/* Filters & Export Options */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-ambedr-200">
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"> */}
          <div className="flex items-center space-x-3">
            <div className="relative ">
              <Filter className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
              </select>
            </div>
            <div className="relative hidden sm:block">
              <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportToCsv}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      </motion.div>

      {/* Visitors Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 ">
              <tr>
                {["Name", "Mobile", "Check In Time", "Check Out Time", "Duration", "Actions"].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider text-center "
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white/ divide-y divide-gray-200">
              {filteredVisitors && filteredVisitors.length > 0 ? (
                filteredVisitors.map((visitor) => (
                  <VisitorRecord
                    key={visitor._id}
                    visitor={visitor}
                    handleVisitorClick={handleVisitorClick}
                    handleManualCheckout={handleManualCheckout}
                    handleUpdateId={handleUpdateId}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No visitors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Visitors;