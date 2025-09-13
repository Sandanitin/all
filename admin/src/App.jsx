import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Login from "./pages/auth/Login";


import ForgotPassword from "./pages/auth/ForgotPassword";

import TestAuth from "./pages/TestAuth";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
    
        <Route path="/forgot-password" element={<ForgotPassword />} />
      
        <Route path="/test-auth" element={<TestAuth />} />

        <Route
          path="/*"
          element={
            <AdminRoute>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-16 pb-20">
                  <Routes>
                    <Route index element={<Dashboard/>} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                  
                  </Routes>
                </div>
                <BottomNav />
              </div>
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
