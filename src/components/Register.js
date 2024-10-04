// src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');

  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nombreUsuario,
      apellidoUsuario,
      correoElectronico,
      contraseña,
    };

    try {
      const response = await axios.post('/api/register', data);

      setMensaje('Registro exitoso. Ahora puedes iniciar sesión.');
      // Redirigir al inicio de sesión después de un breve retraso
      setTimeout(() => {
        history.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error al registrar:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setMensaje(error.response.data.error);
      } else {
        setMensaje('Error al registrar. Por favor, intenta más tarde.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar Nuevo Usuario</h2>
      {mensaje && <p className="error-message">{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Apellido de Usuario:</label>
          <input
            type="text"
            value={apellidoUsuario}
            onChange={(e) => setApellidoUsuario(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Dirección de Correo Electrónico:</label>
          <input
            type="email"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;