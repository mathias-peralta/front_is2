import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const CreateWorkspace = () => {
  //Estado para el nombre del espacio de trabajo
  const [nombre, setNombre] = useState('');

  //Estado para la lista de usuarios disponibles
  const [usuarios, setUsuarios] = useState([]);

  //Estado para los usuarios seleccionados
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);

  //Estado para mensajes de exito o error
  const [mensaje, setMensaje] = useState('');

  //Obtener la lista de usuarios cuando el componente se monta
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('/api/usuarios');
        const opcionesUsuarios = response.data.map((usuario) => ({
          value: usuario.id,
          label: usuario.nombre,
        }));
        setUsuarios(opcionesUsuarios);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  //Manejar el envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Preparar los datos para enviar al backend
    const data = {
      nombre,
      usuarios_id: usuariosSeleccionados.map((usuario) => usuario.value),
    };

    try {
      // Configurar el token de autenticación si es necesario
      const token = localStorage.getItem('token'); // Supongamos que el token está almacenado en localStorage
      const config = {
        headers: {
            headers: { Authorization: 'Bearer ${token}'},
        },
      };
      //Enviar la solicitud POST al backend
      const response = await axios.post('/api/espacios', data);


      //Mostrar mensaje de exito y limpiar el formulario
      setMensaje('Espacio de trabajo creado exitosamente.');
      setNombre('');
      setUsuariosSeleccionados([]);
    } catch (error) {
      console.error('Error al crear el espacio de trabajo:', error);
      setMensaje('Error al crear el espacio de trabajo. Por favor, intenta de nuevo.');
    }
  };

  // Estilos básicos
  const styles = {
    formContainer: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '8px',
      boxSizing: 'border-box',
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
    },
    message: {
      textAlign: 'center',
      marginBottom: '15px',
      color: 'green',
    },
  };

  return (
    <div style={styles.formContainer}>
      <h2>Crear Espacio de Trabajo</h2>
      {mensaje && <p style={styles.message}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre del Espacio de Trabajo:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Asignar Usuarios:</label>
          <Select
            isMulti
            options={usuarios}
            value={usuariosSeleccionados}
            onChange={setUsuariosSeleccionados}
            placeholder="Selecciona usuarios..."
          />
        </div>
        <button type="submit" style={styles.button}>
          Crear Espacio
        </button>
      </form>
    </div>
  );
};

export default CreateWorkspace;