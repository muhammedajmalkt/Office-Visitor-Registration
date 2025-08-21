import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

const useCurrentAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
console.log(admin);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {        
        const res = await axiosInstance.get("/admin/adminin"); 
        setAdmin(res.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load admin");
         toast.error( err.response?.data?.message || err.message || "Failed to load admin" );
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  return { admin, loading, error };
};

export default useCurrentAdmin;
