// src/components/CreateBoard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const CreateBoard = () => {
  const [nombreTablero, setNombreTablero] = useState('');
  const [espaciosTrabajo, setEspaciosTrabajo] = useState([]);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const history = useNavigate();

  // Obtener la lista de espacios de trabajo del usuario al cargar el componente
  useEffect(() => {
    const fetchEspaciosTrabajo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMensaje('No estás autenticado. Por favor, inicia sesión.');
          return;
        }
        const response = await axios.get('/API_URL/espacios', {
          headers: { Authorization: 'Bearer ${token}'},
        });
        setEspaciosTrabajo(response.data);
      } catch (error) {
        console.error('Error al obtener los espacios de trabajo:', error);
        setMensaje('Error al cargar los espacios de trabajo.');
      }
    };

    fetchEspaciosTrabajo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que los campos no estén vacíos
    if (!nombreTablero.trim() || !espacioSeleccionado) {
      setMensaje('Por favor, completa todos los campos.');
      return;
    }

    const data = {
      nombre: nombreTablero.trim(),
      espacio_id: espacioSeleccionado,
    };

    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setMensaje('No estás autenticado. Por favor, inicia sesión.');
        setCargando(false);
        return;
      }
      const response = await axios.post('/API_URL/tableros', data, {
        headers: { Authorization: 'Bearer ${token}'},
      });

      // Verificar que la respuesta contiene el ID del tablero
      if (response.data && response.data.id) {
        // Redirigir al usuario a la vista del tablero recién creado
        history.push('/tableros/${response.data.id}');
      } else {
        setMensaje('Error inesperado al crear el tablero.');
      }
    } catch (error) {
      console.error('Error al crear el tablero:', error);

      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        if (error.response.status === 401) {
          setMensaje('No estás autorizado para crear tableros. Por favor, inicia sesión.');
        } else if (error.response.status === 400) {
          setMensaje('Datos inválidos. Por favor, verifica la información ingresada.');
        } else {
          setMensaje('Error del servidor al crear el tablero. Por favor, intenta más tarde.');
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setMensaje('No se recibió respuesta del servidor. Por favor, verifica tu conexión.');
      } else {
        // Ocurrió un error al configurar la solicitud
        setMensaje('Error al crear el tablero. Por favor, intenta de nuevo.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Nuevo Tablero</h2>
      {mensaje && <p className="error-message">{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Tablero:</label>
          <input
            type="text"
            value={nombreTablero}
            onChange={(e) => setNombreTablero(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Espacio de Trabajo Asociado:</label>
          <select
            value={espacioSeleccionado}
            onChange={(e) => setEspacioSeleccionado(e.target.value)}
            required
          >
            <option value="">Seleccione un espacio de trabajo</option>
            {espaciosTrabajo.map((espacio) => (
              <option key={espacio.id} value={espacio.id}>
                {espacio.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={cargando}>
          {cargando ? 'Creando...' : 'Crear Tablero'}
        </button>
      </form>
    </div>
  );
};

export default CreateBoard;