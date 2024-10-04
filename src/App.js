// src/App.js

import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
// Importa otros componentes como Dashboard, etc.

import CreateWorkspace from './components/CreateWorkspace';

function App() {
  return (
      <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          {/* Rutas protegidas */}
          {/* <PrivateRoute path="/dashboard" component={Dashboard} /> */}
          <Route path="/espaciotrabajo" element={<CreateWorkspace/>}/>
        </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;