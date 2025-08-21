import { motion } from "framer-motion";
import { Search, Filter, Calendar, Download, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import VisitorRecord from "./VisitorRecord";

const Visitors = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
  filterOffice,
  setFilterOffice,
  filteredVisitors,
  visitors,
  handleExportToCsv,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const totalPages = Math.ceil(filteredVisitors.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredVisitors.slice(indexOfFirstRecord, indexOfLastRecord);

  // Compute unique offices from visitors data
  const uniqueOffices = [...new Set(visitors.map(visitor => visitor.office).filter(office => office))];
  const offices = [
    { value: "", label: "All Offices" },
    ...uniqueOffices.map(office => ({
      value: office,
      label: `${office.charAt(0).toUpperCase() + office.slice(1)}`
    }))
  ];

  // Pagination navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for display (show limited pages for brevity)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show up to 5 page numbers at a time
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if endPage reaches totalPages
    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Visitors Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"> Visitor Records            </h2>
             <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search visitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button
            onClick={fetchVisitors}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            title="Refresh"
          >
            <RefreshCcw />
          </button>
        </div>
      </div>

      {/* Filters & Export Options */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex  items-center space-x-3 flex-wrap ">
            <div className="relative">
              <Filter className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="checkedIn">Checked In</option>
                <option value="checkedOut">Checked Out</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 1 Week</option>
                <option value="month">Last 1 Month</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterOffice}
                onChange={(e) => setFilterOffice(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-indigo-500"
              >
                {offices.map(office => (
                  <option key={office.value} value={office.value}>{office.label}</option>
                ))}
              </select>
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
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Mobile", "Office", "Check In Time", "Check Out Time", "Duration", "Actions"].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords && currentRecords.length > 0 ? (
                currentRecords.map((visitor) => (
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
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No visitors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center space-x-2 mt-4"
        >
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === pageNumber
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Visitors;