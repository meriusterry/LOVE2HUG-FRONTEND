import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // Check if user is logged in and is admin
  if (!user || user.role !== 'admin') {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  // If admin, render the children components
  return children;
};

export default AdminRoute;