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
  const [tareas, setTareas] = useState({}); // Almacena las tareas por lista

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

        // Obtener las tareas para cada lista
        const tareasPorLista = {};
        for (const lista of response.data.listas) {
          const resTareas = await axios.get('/api/listas/${lista.id}/tareas', {
            headers: { Authorization: 'Bearer ${token}'},
          });
          tareasPorLista[lista.id] = resTareas.data;
        }
        setTareas(tareasPorLista);

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
      // Añadir nueva lista de tareas vacía
      setTareas({ ...tareas, [response.data.id]: [] });

    } catch (error) {
      console.error('Error al crear la lista:', error);
      setMensaje('Error al crear la lista. Por favor, intenta de nuevo.');
    }
  };

// Manejar la creación de una nueva tarea
  const handleCrearTarea = async (listaId, nombreTarea) => {
    const data = {
      nombre: nombreTarea,
      lista_id: listaId,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/tareas', data, {
        headers: { Authorization: 'Bearer ${token}'},
      });

// Actualizar las tareas de la lista
setTareas({
    ...tareas,
    [listaId]: [...tareas[listaId], response.data],
  });
} catch (error) {
  console.error('Error al crear la tarea:', error);
  setMensaje('Error al crear la tarea. Por favor, intenta de nuevo.');
}
};

// Función para verificar si una lista ha alcanzado o superado su maxWIP
const esWIPExcedido = (listaId) => {
    const numTareas = tareas[listaId] ? tareas[listaId].length : 0;
    const lista = listas.find((l) => l.id === listaId);
    return numTareas >= lista.maxWIP;
  };

  // Mostrar una alerta si alguna lista ha excedido su maxWIP
  useEffect(() => {
    listas.forEach((lista) => {
      if (esWIPExcedido(lista.id)) {
        alert("La lista", "${lista.nombre}", "ha alcanzado o superado su límite máximo de tareas.");
      }
    });
  }, [tareas, listas]);

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
              <div key={lista.id} className="lista" style={{
                backgroundColor: esWIPExcedido(lista.id) ? '#ffcccc' : '#f0f0f0'}}>
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
                    <p>Tareas: {tareas[lista.id] ? tareas[lista.id].length : 0}</p>
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
                {/* Formulario para agregar una nueva tarea */}
                <AgregarTareaForm
                      listaId={lista.id}
                      handleCrearTarea={handleCrearTarea}
                    />

                    {/* Mostrar las tareas de la lista */}
                    <ul className="tareas-list">
                      {tareas[lista.id] &&
                        tareas[lista.id].map((tarea) => (
                          <li key={tarea.id}>{tarea.nombre}</li>
                        ))}
                    </ul>
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

// Componente para agregar una nueva tarea
const AgregarTareaForm = ({ listaId, handleCrearTarea }) => {
    const [nombreTarea, setNombreTarea] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      handleCrearTarea(listaId, nombreTarea);
      setNombreTarea('');
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nueva Tarea:</label>
          <input
            type="text"
            value={nombreTarea}
            onChange={(e) => setNombreTarea(e.target.value)}
            required
          />
        </div>
        <button type="submit">Agregar Tarea</button>
      </form>
    );
  };

export default Board;