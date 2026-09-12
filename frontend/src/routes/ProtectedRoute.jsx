import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessPath, getRoleLanding } from '../utils/roleAccess';

/**
 * Blocks unauthenticated visitors AND blocks signed-in users from opening a
 * page their role is not allowed to see (typing a URL directly, bookmarks,
 * shared links...). A blocked user lands on the first page their role may open.
 *
 * Usage:
 *   <Route path="/fabrics" element={<ProtectedRoute requiredPath="/fabrics"><FabricList /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children, requiredPath }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPath && !canAccessPath(user?.role, requiredPath)) {
    return (
      <Navigate
        to={getRoleLanding(user?.role) || '/login'}
        replace
        state={{ deniedPath: location.pathname }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
