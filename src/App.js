import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; 
import { AuthProvider, AuthContext } from './context/AuthContext'; 
import Login from './components/Auth/Login';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import Register from './components/Auth/Register';
import Logout from './components/Auth/Logout';
import EditMember from './components/Team/EditMember';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AddEditProduct from './components/Products/AddEditProduct';

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation(); 

  
  const excludedRoutes = ['/login'];

  return (
    <>
      
      {user && !excludedRoutes.includes(location.pathname) && <Logout />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/manager" element={
          <ProtectedRoute role="Manager">
            <ManagerDashboard />
          </ProtectedRoute>
          } 
          /> 
          <Route path="/employee" element={
          <ProtectedRoute role="Employee">
            <EmployeeDashboard />
          </ProtectedRoute>
          } 
          /> 
        

        <Route path="/auth/update/:id" element={<EditMember />} />
        <Route path="/products/:id" element={<AddEditProduct />} />
        
        <Route path="/" element={<Logout />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;

