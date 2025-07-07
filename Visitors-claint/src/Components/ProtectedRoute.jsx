import { Navigate, Outlet } from 'react-router-dom';
import useCurrentAdmin from './Hooks/useCurrentAdmin';

const ProtectedRoute = ({ redirectPath = '/admin', children }) => {
  const { admin, loading } = useCurrentAdmin();
// console.log(admin);

  if (loading) {
    return <div className="flex justify-center items-center h-[90vh] w-screen bg-ambwer-50">
      <div className="text-center flex items-center gap-4 justify-center ">
        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className=" text-gray-600 font-medium ">Loading...</p>
      </div>
    </div>
  }

  if (!admin) {
    return <Navigate to={redirectPath} replace />;
  }

  return children 
};

export default ProtectedRoute;