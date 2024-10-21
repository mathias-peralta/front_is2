import { getTablerosByWorkspace, createTablero, TableroResponse } from "../../api/tablero";
import HomeLayout from "@/layouts/home/layout";
import AlertContext from "@/providers/alertProvider";
import { Box, Button, Divider, MenuItem, Modal, TextField, Typography, CircularProgress } from "@mui/material";
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
import { useRouter } from "next/router"; // Importar useRouter para obtener el id_espacio

interface FormikProps {
  tableroName: string;
  id_espacio: number;
}

const TableroPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tablerosList, setTablerosList] = useState<TableroResponse[] | null>(null);
  const alert = useContext(AlertContext);
  const router = useRouter();
  const { id_espacio } = router.query; // Obtener el id_espacio de la URL

  useEffect(() => {
    if (id_espacio) {
      getTableros(Number(id_espacio)); // Cargar los tableros cuando se carga el componente
    }
  }, [id_espacio]);

  const getTableros = async (id_espacio: number) => {
    setIsLoading(true);
    const tableros = await getTablerosByWorkspace(id_espacio);
    setTablerosList(tableros);
    setIsLoading(false);
  };

  const handleModal = () => setModalIsOpen(!modalIsOpen);

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

  const validationSchema = Yup.object({
    tableroName: Yup.string().max(255).required("Este campo es requerido"),
    id_espacio: Yup.number().required("Debes seleccionar un espacio de trabajo"),
  });

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
      id_espacio: Number(id_espacio),
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

      <Typography variant="h4">Tableros del Espacio de Trabajo</Typography>
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
