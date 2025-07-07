import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { format, differenceInMinutes } from "date-fns";
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


 const fetchVisitors = async () => {
  setLoading(true);
  try {
    const res = await axiosInstance("/visitors/allvisitors"); 
    const fetchedVisitors = res.data.data;

    const todayDate = new Date().toDateString();
    let checkedIn = 0, checkedOut = 0, today = 0;
    const purposeCount = {}, dayCount = {}, last7DaysData = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, "MMM dd");
      last7DaysData[dateStr] = 0;
    }

    fetchedVisitors.forEach(visitor => {
      const checkInTime = new Date(visitor.checkInTime);

      if (visitor.checkOutTime) checkedOut++;
      else checkedIn++;

      if (checkInTime.toDateString() === todayDate) today++;

      const purpose = visitor.purpose || "Unknown";
      purposeCount[purpose] = (purposeCount[purpose] || 0) + 1;

      const day = checkInTime.toLocaleDateString("en-US", { weekday: "short" });
      dayCount[day] = (dayCount[day] || 0) + 1;

      if (checkInTime >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
        const dateStr = format(checkInTime, "MMM dd");
        last7DaysData[dateStr] = (last7DaysData[dateStr] || 0) + 1;
      }
    });

    setVisitors(fetchedVisitors);
    setActiveVisitors(fetchedVisitors.filter(v => !v.checkOutTime));
    setStats({ total: fetchedVisitors.length, checkedIn, checkedOut, today });
    setVisitorsByPurpose(Object.entries(purposeCount).map(([name, value]) => ({ name, value })));
    setVisitorsByDay(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => ({ name: day, visitors: dayCount[day] || 0 })));
    setVisitorTrend(Object.entries(last7DaysData).map(([date, visitors]) => ({ date, visitors })));
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
      text: 'Failed to update ID information',
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
    MySwal.fire({
      title: 'Visitor Details',
      html: `
        <div class="text-left">
          <div class="flex items-center justify-center mb-4 ">
            <img src="${visitors.find(v => v._id === visitorId)?.imageUrl || ''}"  alt="img"
                 class="h-54 w-54 rounded-full object-cover border" />
          </div>
          <div class="space-y-2">
            <div><strong>Name:</strong> ${visitors.find(v => v._id === visitorId)?.name || 'N/A'}</div>
            <div><strong>Mobile:</strong> ${visitors.find(v => v._id === visitorId)?.mobile || 'N/A'}</div>
            <div><strong>Purpose:</strong> ${visitors.find(v => v._id === visitorId)?.purpose || 'N/A'}</div>
            <div ><strong>Check-In:</strong> ${visitors.find(v => v._id === visitorId)?.checkInTime ? format(visitors.find(v => v._id === visitorId).checkInTime, "MMM dd, yyyy h:mm a") : 'N/A'}</div>
            <div><strong>Check-Out:</strong> ${visitors.find(v => v._id === visitorId)?.checkOutTime ? format(visitors.find(v => v._id === visitorId).checkOutTime, "MMM dd, yyyy h:mm a") : 'N/A'}</div>
            <div><strong>ID Type:</strong> ${visitors.find(v => v._id === visitorId)?.idType.toUpperCase()|| 'N/A'}</div>
            <div><strong>ID Number:</strong> ${visitors.find(v => v._id === visitorId)?.idNumber || 'N/A'}</div>
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

    if (filterStatus !== "all" && visitor.status !== filterStatus) {
      return false;
    }

    if (filterDate) {
      const visitorDate = new Date(visitor.checkInTime).toISOString().split("T")[0];
      if (visitorDate !== filterDate) {
        return false;
      }
    }

    return true;
  });
};

// console.log(visitors);
// console.log(admin );


  const handleExportToCsv = () => {
    const filtered = getFilteredVisitors();
    const headers = ["Name", "Mobile", "Email", "Purpose", "Check-In Time", "Check-Out Time", "Status"];
    
    const csvContent = [
      headers.join(","),
      ...filtered.map(visitor => [
        `"${visitor.name || "N/A"}"`,
        visitor.mobile || "N/A",
        visitor.email || "N/A",
        `"${visitor.purpose || "N/A"}"`,
        visitor.checkInTime ? format(visitor.checkInTime, "yyyy-MM-dd HH:mm:ss") : "N/A",
        visitor.checkOutTime ? format(visitor.checkOutTime, "yyyy-MM-dd HH:mm:ss") : "N/A",
        visitor.status || "N/A"
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `visitors_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
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
  {loading || adminLoading? (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="text-center flex items-center gap-4 justify-center ">
        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className=" text-gray-600 font-medium ">Loading...</p>
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
          filteredVisitors={getFilteredVisitors()}
          handleExportToCsv={handleExportToCsv}
          handlePrint={handlePrint}
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
          handlePrint={handlePrint}
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