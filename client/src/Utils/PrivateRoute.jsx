import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from './AuthRequests';

// creates private route handler
function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to='/' />;
}

export default PrivateRoute;
