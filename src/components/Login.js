//src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
//import Dashboard from './src/components/Dashboard';
import api from '../api';


const Login = () => {
  const [correoUsuario, setCorreoUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      correoUsuario,
      contrasena,
    };

    try {
      //Realizar la solicitud POST al endpoint de autenticacion
      const response = await api.post('/login', data);

      //Suponiendo que el token viene en response.data.token
      const token = response.data.token;

      //Guardar el token en localStorage u otro lugar seguro
      localStorage.setItem('token', token);

      //Redirigir al usuario a la pagina principal
      history.push('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      //Manejar diferentes tipos de errores
      if (error.response && error.response.status === 401) {
        setMensaje('Credenciales incorrectas. Por favor, intenta de nuevo.');
      } else {
        setMensaje('Error al iniciar sesión. Por favor, intenta más tarde.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      {mensaje && <p className="error-message">{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input
            type="text"
            value={correoUsuario}
            onChange={(e) => setCorreoUsuario(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;