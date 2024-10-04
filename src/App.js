// src/App.js

import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
// Importa otros componentes como Dashboard, etc.

import CreateWorkspace from './components/CreateWorkspace';
import CreateBoard from './components/CreateBoard';
import Board from './components/Board';


function App() {
  return (
      <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          {/* Rutas protegidas */}
          {/* <PrivateRoute path="/dashboard" component={Dashboard} /> */}
          <Route path="/create-workspace" element={<CreateWorkspace/>}/>
          <Route path="/create-board" element={<CreateBoard/>}/>
          <Route path="/tableros/:id" element={<Board/>}/>
          {/* Otras rutas protegidas */}
        </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;