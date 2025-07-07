import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CheckIn from './Components/pages/CheckIn';
import AdminDashboard from './Components/pages/AdminDashboard';
import AdminLogin from './Components/pages/AdminLogin';
import CheckOut from './Components/pages/CheckOut';
import NotFound from './Components/pages/NotFound';

import ProtectedRoute from './Components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    
    <Router>
            <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<CheckIn />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={ 
          <ProtectedRoute>
           <AdminDashboard />
        </ProtectedRoute>
       } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
