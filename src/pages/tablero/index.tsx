import { getAllWorkspaces, WorkspaceResponse } from "@/api/workspace";
import { getTablerosByWorkspace, createTablero, TableroResponse } from "../../api/tablero";
import HomeLayout from "@/layouts/home/layout";
import AlertContext from "@/providers/alertProvider";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Modal,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { getCurrentUserId } from "../../utils/auth";

interface FormikProps {
  tableroName: string;
  id_espacio: number;
}

const TableroPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceList, setWorkspaceList] = useState<WorkspaceResponse[] | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);
  const [tablerosList, setTablerosList] = useState<TableroResponse[] | null>(null);
  const alert = useContext(AlertContext);

  // Cargar espacios de trabajo del usuario
  useEffect(() => {
    getData();
  }, []);

  // Obtener tableros cuando se selecciona un espacio de trabajo
  useEffect(() => {
    if (selectedWorkspace) {
      getTableros(selectedWorkspace); // Obtener los tableros asociados
    }
  }, [selectedWorkspace]);

  // Obtener los espacios de trabajo
  const getData = async () => {
    const userId = Number(getCurrentUserId());
    const workspaceList = await getAllWorkspaces(userId);
    setWorkspaceList(workspaceList);
  };

  // Obtener tableros asociados a un espacio de trabajo
  const getTableros = async (id_espacio: number) => {
    setIsLoading(true);
    const tableros = await getTablerosByWorkspace(id_espacio);
    setTablerosList(tableros); // Actualizar la lista de tableros
    setIsLoading(false);
  };

  // Manejar el modal de creación de tableros
  const handleModal = () => setModalIsOpen(!modalIsOpen);

  // Crear un nuevo tablero
  const handleOnSubmit = async (values: FormikProps) => {
    try {
      setIsLoading(true);

      const response = await createTablero({
        id_espacio: values.id_espacio,
        nombre_tablero: values.tableroName,
      });

      if (!response) {
        throw new Error("Error al crear el tablero");
      }

      alert.handleAlert("Tablero creado exitosamente", 1, "success");
      handleModal(); // Cierra el modal
      getTableros(values.id_espacio); // Recargar los tableros
    } catch (error) {
      console.error(error);
      alert.handleAlert("Algo salió mal al crear el tablero", 3, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Validación de campos
  const validationSchema = Yup.object({
    tableroName: Yup.string().max(255).required("Este campo es requerido"),
    id_espacio: Yup.number().required("Debes seleccionar un espacio de trabajo"),
  });

  // Manejo del formulario
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<FormikProps>({
    initialValues: {
      tableroName: "",
      id_espacio: 0,
    },
    validationSchema: validationSchema,
    onSubmit: handleOnSubmit,
  });

  return (
    <>
      {/* Modal para crear nuevo tablero */}
      <Modal
        open={modalIsOpen}
        onClose={handleModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">Crear nuevo tablero</Typography>
          <TextField
            error={!!(touched.tableroName && errors.tableroName)}
            fullWidth
            helperText={touched.tableroName && errors.tableroName}
            label="Nombre del tablero"
            name="tableroName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.tableroName}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            id="outlined-select-currency"
            select
            label="Espacio de trabajo"
            name="id_espacio"
            value={values.id_espacio}
            onChange={(event) => {
              handleChange(event);
              setSelectedWorkspace(Number(event.target.value)); // Actualiza el workspace seleccionado
            }}
            fullWidth
            sx={{ marginBottom: 1 }}
            disabled={isLoading}
          >
            {workspaceList &&
              workspaceList.map((item, index) => (
                <MenuItem key={index} value={item.id_espacio}>
                  {item.nombre_espacio}
                </MenuItem>
              ))}
          </TextField>
          <Button 
            variant="contained" 
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(); // Crear tablero
            }} 
            fullWidth
          >
            Crear
          </Button>
        </Box>
      </Modal>

      <Typography variant="body1">Tableros</Typography>
      <Button variant="contained" size="medium" onClick={handleModal}>
        Nuevo tablero
      </Button>

      <Divider sx={{ marginTop: 2 }} />

      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Tablero</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tablerosList?.map((tablero) => (
                <TableRow key={tablero.id_tablero}>
                  <TableCell>{tablero.nombre_tablero}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default TableroPage;

TableroPage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
