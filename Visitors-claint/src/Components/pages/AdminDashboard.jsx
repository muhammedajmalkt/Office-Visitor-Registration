import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { format, differenceInMinutes, startOfDay, subDays, subWeeks, subMonths, subYears } from "date-fns";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Sidebar from "../DashBoard/layout/Sidebar";
import Header from "../DashBoard/layout/Header";
import Dashboard from "../DashBoard/dashboard/Dashboard";
import Visitors from "../DashBoard/visitors/Visitors";
import Reports from "../DashBoard/visitors/Reports";
import Settings from "../DashBoard/settings/Settings";
import axiosInstance from "../../api/axiosInstance";
import useCurrentAdmin from "../Hooks/useCurrentAdmin";

const MySwal = withReactContent(Swal);

const AdminDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    checkedIn: 0,
    checkedOut: 0,
    today: 0,
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterOffice, setFilterOffice] = useState("");
  const [trendFilter, setTrendFilter] = useState("week");
  const [loading, setLoading] = useState(true);
  const [visitorsByPurpose, setVisitorsByPurpose] = useState([]);
  const [visitorsByDay, setVisitorsByDay] = useState([]);
  const [visitorTrend, setVisitorTrend] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const { admin, loading: adminLoading, error } = useCurrentAdmin();

  const navigate = useNavigate();

  const computeChartData = (fetchedVisitors, filterDate, trendFilter) => {
    const now = new Date();
    const purposeCount = {};
    let dayCount = {};
    let trendData = {};

    if (filterDate === "today" || filterDate === "yesterday") {
      dayCount = { [format(filterDate === "today" ? now : subDays(now, 1), "MMM dd")]: 0 };
    } else if (filterDate === "week") {
      dayCount = {};
      for (let i = 6; i >= 0; i--) {
        const date = subDays(now, i);
        dayCount[format(date, "MMM dd")] = 0;
      }
    } else if (filterDate === "month") {
      dayCount = {};
      for (let i = 3; i >= 0; i--) {
        const date = subWeeks(now, i);
        dayCount[`Week ${4 - i}`] = 0;
      }
    } else if (filterDate === "sixMonths" || filterDate === "year") {
      dayCount = {};
      const months = filterDate === "sixMonths" ? 6 : 12;
      for (let i = months - 1; i >= 0; i--) {
        const date = subMonths(now, i);
        dayCount[format(date, "MMM yyyy")] = 0;
      }
    } else {
      dayCount = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    }

    const trendDays = trendFilter === "week" ? 7 : trendFilter === "month" ? 30 : 90;
    trendData = {};
    for (let i = trendDays - 1; i >= 0; i--) {
      const date = subDays(now, i);
      trendData[format(date, "MMM dd")] = 0;
    }

    const filteredVisitors = fetchedVisitors.filter(visitor => {
      const visitorDate = new Date(visitor.checkInTime);
      if (filterDate === "today") {
        return visitorDate.toDateString() === now.toDateString();
      } else if (filterDate === "yesterday") {
        const yesterday = subDays(now, 1);
        return visitorDate.toDateString() === yesterday.toDateString();
      } else if (filterDate === "week") {
        const weekAgo = subDays(now, 7);
        return visitorDate >= weekAgo;
      } else if (filterDate === "month") {
        const monthAgo = subDays(now, 30);
        return visitorDate >= monthAgo;
      } else if (filterDate === "sixMonths") {
        const sixMonthsAgo = subMonths(now, 6);
        return visitorDate >= sixMonthsAgo;
      } else if (filterDate === "year") {
        const yearAgo = subYears(now, 1);
        return visitorDate >= yearAgo;
      }
      return true; // All Dates
    });

    filteredVisitors.forEach(visitor => {
      const checkInTime = new Date(visitor.checkInTime);
      const purpose = visitor.purpose || "Unknown";
      purposeCount[purpose] = (purposeCount[purpose] || 0) + 1;

      if (filterDate === "today" || filterDate === "yesterday") {
        const dateStr = format(checkInTime, "MMM dd");
        if (dayCount[dateStr] !== undefined) {
          dayCount[dateStr]++;
        }
      } else if (filterDate === "week") {
        const dateStr = format(checkInTime, "MMM dd");
        if (dayCount[dateStr] !== undefined) {
          dayCount[dateStr]++;
        }
      } else if (filterDate === "month") {
        const weeksAgo = Math.floor((now - checkInTime) / (7 * 24 * 60 * 60 * 1000));
        const weekKey = `Week ${Math.min(4, 4 - weeksAgo)}`;
        if (dayCount[weekKey] !== undefined) {
          dayCount[weekKey]++;
        }
      } else if (filterDate === "sixMonths" || filterDate === "year") {
        const monthStr = format(checkInTime, "MMM yyyy");
        if (dayCount[monthStr] !== undefined) {
          dayCount[monthStr]++;
        }
      } else {
        const day = checkInTime.toLocaleDateString("en-US", { weekday: "short" });
        dayCount[day]++;
      }
    });

    fetchedVisitors.forEach(visitor => {
      const checkInTime = new Date(visitor.checkInTime);
      if (
        checkInTime >= subDays(now, trendDays) &&
        checkInTime <= now
      ) {
        const dateStr = format(checkInTime, "MMM dd");
        trendData[dateStr] = (trendData[dateStr] || 0) + 1;
      }
    });

    const visitorsByDayData = Object.entries(dayCount).map(([name, visitors]) => ({ name, visitors, }));
    const visitorsByPurposeData = Object.entries(purposeCount).map(([name, value]) => ({ name, value, }));
    const visitorTrendData = Object.entries(trendData).map(([date, visitors]) => ({ date, visitors, }));
    return { visitorsByDayData, visitorsByPurposeData, visitorTrendData };
  };

  useEffect(() => {
    fetchVisitors();

    // Handle mobile view
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const { visitorsByDayData, visitorsByPurposeData, visitorTrendData } = computeChartData(visitors, filterDate, trendFilter);
    setVisitorsByDay(visitorsByDayData);
    setVisitorsByPurpose(visitorsByPurposeData);
    setVisitorTrend(visitorTrendData);
  }, [filterDate, trendFilter, visitors]);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance("/visitors/allvisitors");
      let fetchedVisitors = res.data.data;

      const todayDate = new Date().toDateString();
      let checkedIn = 0, checkedOut = 0, today = 0;

      fetchedVisitors.forEach(visitor => {
        const checkInTime = new Date(visitor.checkInTime);
        if (visitor.checkOutTime) checkedOut++;
        else checkedIn++;
        if (checkInTime.toDateString() === todayDate) today++;
      });

      setVisitors(fetchedVisitors);
      setActiveVisitors(fetchedVisitors.filter(v => !v.checkOutTime));
      setStats({ total: fetchedVisitors.length, checkedIn, checkedOut, today });

      // Compute initial chart data based on current filterDate and trendFilter
      const { visitorsByDayData, visitorsByPurposeData, visitorTrendData } = computeChartData(fetchedVisitors, filterDate, trendFilter);
      setVisitorsByDay(visitorsByDayData);
      setVisitorsByPurpose(visitorsByPurposeData);
      setVisitorTrend(visitorTrendData);
    } catch (error) {
      MySwal.fire({ icon: 'error', title: 'Error', text: 'Failed to load visitors from backend' });
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckout = async (visitorId) => {
    const result = await MySwal.fire({
      title: 'Confirm Check-Out',
      text: 'Are you sure you want to check out this visitor?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Check Out',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const visitor = visitors.find(v => v._id === visitorId || v.id === visitorId);
        const res = await axiosInstance.post("/visitors/checkout", { mobile: visitor.mobile });

        await fetchVisitors();
        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: res.data.message,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        MySwal.fire({ icon: 'error', title: 'Error', text: 'Check-out failed' });
      }
    }
  };

  const handleUpdateId = async (visitorId) => {
    const result = await MySwal.fire({
      title: 'Update ID Information',
      html: `
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
          <select id="idType" class="swal2-input">
            <option value="aadhar">Aadhar</option>
            <option value="passport">Passport</option>
            <option value="pan">Pan</option>
            <option value="license">Driver's License</option>
            <option value="voter">Voter ID</option>
            <option value="other">Other</option>
          </select>
          <label class="block text-sm font-medium text-gray-700 mt-4 mb-1">ID Number</label>
          <input id="idNumber" class="swal2-input" placeholder="Enter ID Number">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const idType = document.getElementById('idType').value;
        const idNumber = document.getElementById('idNumber').value;
        if (!idType || !idNumber) {
          MySwal.showValidationMessage('Please fill in both fields');
          return false;
        }
        return { idType, idNumber };
      },
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.put(`/visitors/update-id/${visitorId}`, {
          idType: result.value.idType,
          idNumber: result.value.idNumber,
        });

        const updated = res.data.data;
        setVisitors(prev => prev.map(v =>
          v._id === visitorId
            ? { ...v, idType: updated.idType, idNumber: updated.idNumber }
            : v
        ));

        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: 'ID information updated successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {        
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to update ID information',
        });
      }
    }
  };

  const handleSignOut = async () => {
    const result = await MySwal.fire({
      title: 'Confirm Sign Out',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post("/admin/logout");
        navigate("/admin");
        MySwal.fire({
          icon: 'success',
          title: 'Signed Out',
          text: 'You have been signed out successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Sign out failed. Try again.',
        });
      }
    }
  };

  const handleVisitorClick = (visitorId) => {
    const visitor = visitors.find(v => v._id === visitorId);
    MySwal.fire({
      title: 'Visitor Details',
      html: `
        <div class="text-left">
          <div class="flex items-center justify-center mb-4">
            <img src="${visitor?.imageUrl || ''}" alt="img"
                 class="h-54 w-54 rounded-full object-cover border" />
          </div>
          <div class="space-y-2">
            <div><strong>Name:</strong> ${visitor?.name || 'N/A'}</div>
            <div><strong>Mobile:</strong> ${visitor?.mobile || 'N/A'}</div>
            <div><strong>Office:</strong> ${visitor?.office ? visitor.office.charAt(0).toUpperCase() + visitor.office.slice(1) : 'N/A'}</div>
            <div><strong>Purpose:</strong> ${visitor?.purpose || 'N/A'}</div>
            <div><strong>Check-In:</strong> ${visitor?.checkInTime ? format(new Date(visitor.checkInTime), "MMM dd, yyyy h:mm a") : 'N/A'}</div>
            <div><strong>Check-Out:</strong> ${visitor?.checkOutTime ? format(new Date(visitor.checkOutTime), "MMM dd, yyyy h:mm a") : 'N/A'}</div>
            <div><strong>ID Type:</strong> ${visitor?.idType ? visitor.idType.toUpperCase() : 'N/A'}</div>
            <div><strong>ID Number:</strong> ${visitor?.idNumber || 'N/A'}</div>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true
    });
  };

  const getFilteredVisitors = () => {
    return visitors.filter((visitor) => {
      const query = searchQuery.toLowerCase();

      if (
        searchQuery &&
        !visitor.name?.toLowerCase().includes(query) &&
        !visitor.purpose?.toLowerCase().includes(query) &&
        !visitor.mobile?.toLowerCase().includes(query) &&
        !visitor.email?.toLowerCase().includes(query)
      ) {
        return false;
      }

      const status = visitor.checkInTime ? (visitor.checkOutTime ? "checkedOut" : "checkedIn") : "unknown";
      if (filterStatus !== "all" && status !== filterStatus) {
        return false;
      }

      if (filterOffice && visitor.office !== filterOffice) {
        return false;
      }

      if (filterDate) {
        const now = new Date();
        const visitorDate = new Date(visitor.checkInTime);
        if (filterDate === "today") {
          if (visitorDate.toDateString() !== now.toDateString()) return false;
        } else if (filterDate === "yesterday") {
          const yesterday = subDays(now, 1);
          if (visitorDate.toDateString() !== yesterday.toDateString()) return false;
        } else if (filterDate === "week") {
          const weekAgo = subDays(now, 7);
          if (visitorDate < weekAgo) return false;
        } else if (filterDate === "month") {
          const monthAgo = subDays(now, 30);
          if (visitorDate < monthAgo) return false;
        } else if (filterDate === "sixMonths") {
          const sixMonthsAgo = subMonths(now, 6);
          if (visitorDate < sixMonthsAgo) return false;
        } else if (filterDate === "year") {
          const yearAgo = subYears(now, 1);
          if (visitorDate < yearAgo) return false;
        }
      }

      return true;
    });
  };

  const handleExportToCsv = () => {
    const filtered = getFilteredVisitors();
    
    if (!filtered || filtered.length === 0) {
      MySwal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'No visitors available to export.',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const headers = ["Name", "Mobile", "Email", "Office", "Purpose", "Check-In Time", "Check-Out Time", "Status"];

    const csvContent = [
      headers.join(","),
      ...filtered.map(visitor => [
        `"${visitor.name || "N/A"}"`,
        `"${visitor.mobile || "N/A"}"`,
        `"${visitor.email || "N/A"}"`,
        `"${visitor.office ? visitor.office.charAt(0).toUpperCase() + visitor.office.slice(1) : "N/A"}"`,
        `"${visitor.purpose || "N/A"}"`,
        `"${visitor.checkInTime ? format(new Date(visitor.checkInTime), "yyyy-MM-dd HH:mm:ss") : "N/A"}"`,
        `"${visitor.checkOutTime ? format(new Date(visitor.checkOutTime), "yyyy-MM-dd HH:mm:ss") : "N/A"}"`,
        `"${visitor.checkOutTime ? "Checked Out" : "Checked In"}"`
      ].join(","))
    ].join("\n");

    try {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `visitors_report_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.csv`);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to export CSV. Please try again.',
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 w-screen">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        handleSignOut={handleSignOut}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Header
          setSidebarOpen={setSidebarOpen}
          notificationCount={notificationCount}
          userEmail={admin?.email || "Admin"}
        />

        <main className="p-6">
          {loading || adminLoading ? (
            <div className="flex justify-center items-center h-[90vh]">
              <div className="text-center flex items-center gap-4 justify-center">
                <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 font-medium">Loading...</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeView === "dashboard" && (
                <Dashboard
                  stats={stats}
                  visitorTrend={visitorTrend}
                  visitorsByPurpose={visitorsByPurpose}
                  activeVisitors={activeVisitors}
                  setActiveView={setActiveView}
                  handleVisitorClick={handleVisitorClick}
                  handleManualCheckout={handleManualCheckout}
                  fetchVisitors={fetchVisitors}
                  trendFilter={trendFilter}
                  setTrendFilter={setTrendFilter}
                />
              )}
              {activeView === "visitors" && (
                <Visitors
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  filterDate={filterDate}
                  setFilterDate={setFilterDate}
                  filterOffice={filterOffice}
                  setFilterOffice={setFilterOffice}
                  filteredVisitors={getFilteredVisitors()}
                  visitors={visitors}
                  handleExportToCsv={handleExportToCsv}
                  handleVisitorClick={handleVisitorClick}
                  handleManualCheckout={handleManualCheckout}
                  handleUpdateId={handleUpdateId}
                  fetchVisitors={fetchVisitors}
                />
              )}
              {activeView === "reports" && (
                <Reports
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterDate={filterDate}
                  setFilterDate={setFilterDate}
                  visitorsByDay={visitorsByDay}
                  visitorsByPurpose={visitorsByPurpose}
                  handleExportToCsv={handleExportToCsv}
                />
              )}
              {activeView === "settings" && <Settings />}
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;