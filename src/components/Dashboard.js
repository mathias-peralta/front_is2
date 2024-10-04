// src/components/Dashboard.js

import React from 'react';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  return (
    <div>
      <h2>Bienvenido al Dashboard</h2>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;