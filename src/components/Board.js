// src/components/Board.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Board = () => {
  const { id } = useParams(); // ID del tablero
  const [tablero, setTablero] = useState(null);
  const [listas, setListas] = useState([]);
  const [nombreLista, setNombreLista] = useState('');
  const [maxWIP, setMaxWIP] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Estados para editar listas
  const [editandoListaId, setEditandoListaId] = useState(null);
  const [nombreListaEdit, setNombreListaEdit] = useState('');
  const [maxWIPEdit, setMaxWIPEdit] = useState('');

  // Obtener datos del tablero y listas
  useEffect(() => {
    const fetchTablero = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/tableros/${id}', {
            headers: { Authorization: 'Bearer ${token}'},
        });
        setTablero(response.data);
        setListas(response.data.listas);
      } catch (error) {
        console.error('Error al cargar el tablero:', error);
        setMensaje('Error al cargar el tablero.');
      }
    };

    fetchTablero();
  }, [id]);

  // Manejar la creación de una nueva lista
  const handleCrearLista = async (e) => {
    e.preventDefault();

    const data = {
      nombre: nombreLista,
      maxWIP: parseInt(maxWIP),
      tablero_id: id,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/listas', data, {
        headers: { Authorization: 'Bearer ${token}'},
      });

      // Actualizar la lista de listas
      setListas([...listas, response.data]);
      setNombreLista('');
      setMaxWIP('');
    } catch (error) {
      console.error('Error al crear la lista:', error);
      setMensaje('Error al crear la lista. Por favor, intenta de nuevo.');
    }
  };

  // Manejar la eliminación de una lista
  const handleEliminarLista = async (listaId) => {
    if (window.confirm('¿Estás seguro de eliminar esta lista?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('/api/listas/${listaId}', {
            headers: { Authorization: 'Bearer ${token}'},
        });

        // Actualizar la lista de listas
        setListas(listas.filter((lista) => lista.id !== listaId));
      } catch (error) {
        console.error('Error al eliminar la lista:', error);
        setMensaje('Error al eliminar la lista. Por favor, intenta de nuevo.');
      }
    }
  };

  // Manejar la edición de una lista
  const handleEditarLista = async (e) => {
    e.preventDefault();

    const data = {
      nombre: nombreListaEdit,
      maxWIP: parseInt(maxWIPEdit),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/listas/${editandoListaId}', data, {
        headers: { Authorization: 'Bearer ${token}'},
      });

      // Actualizar la lista de listas
      setListas(
        listas.map((lista) =>
          lista.id === editandoListaId ? response.data : lista
        )
      );
      setEditandoListaId(null);
      setNombreListaEdit('');
      setMaxWIPEdit('');
    } catch (error) {
      console.error('Error al editar la lista:', error);
      setMensaje('Error al editar la lista. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="board-container">
      {mensaje && <p className="error-message">{mensaje}</p>}
      {tablero ? (
        <>
          <h2>{tablero.nombre}</h2>

          {/* Formulario para crear una nueva lista */}
          <div className="create-list-form">
            <h3>Agregar Nueva Lista</h3>
            <form onSubmit={handleCrearLista}>
              <div className="form-group">
                <label>Nombre de la Lista:</label>
                <input
                  type="text"
                  value={nombreLista}
                  onChange={(e) => setNombreLista(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Límite Máximo de Tareas (max WIP):</label>
                <input
                  type="number"
                  value={maxWIP}
                  onChange={(e) => setMaxWIP(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Agregar Lista</button>
            </form>
          </div>

          {/* Mostrar las listas existentes */}
          <div className="listas-container">
            {listas.map((lista) => (
              <div key={lista.id} className="lista">
                {editandoListaId === lista.id ? (
                  // Formulario de edición
                  <form onSubmit={handleEditarLista}>
                    <div className="form-group">
                      <label>Nombre de la Lista:</label>
                      <input
                        type="text"
                        value={nombreListaEdit}
                        onChange={(e) => setNombreListaEdit(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Límite Máximo de Tareas (max WIP):</label>
                      <input
                        type="number"
                        value={maxWIPEdit}
                        onChange={(e) => setMaxWIPEdit(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit">Guardar Cambios</button>
                    <button
                      type="button"
                      onClick={() => setEditandoListaId(null)}
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  // Vista de la lista
                  <>
                    <h4>{lista.nombre}</h4>
                    <p>Max WIP: {lista.maxWIP}</p>
                    <button
                      onClick={() => {
                        setEditandoListaId(lista.id);
                        setNombreListaEdit(lista.nombre);
                        setMaxWIPEdit(lista.maxWIP);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleEliminarLista(lista.id)}>
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Cargando tablero...</p>
      )}
    </div>
  );
};

export default Board;