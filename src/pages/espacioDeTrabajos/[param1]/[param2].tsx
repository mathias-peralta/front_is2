import {
  crearLista,
  deleteByIdLista,
  getListByIdTablero,
} from "@/api/apiListas";
import HomeLayout from "@/layouts/home/layout";
import { ListasByIDTableroResponse } from "@/models/response/listaResponse";
import AlertContext from "@/providers/alertProvider";
import { Add } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
interface FormikProps {
  listName: string;
  listMaxLength: string;
}

const ListPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listas, setListas] = useState<ListasByIDTableroResponse[] | null>(
    null
  );
  const [listaSeleccionada, setListaSeleccionada] =
    useState<ListasByIDTableroResponse | null>(null);
  const alert = useContext(AlertContext);
  const { param2 } = router.query; // `id` es el parámetro dinámico que obtienes de la URL

  useEffect(() => {
    getListas();
  }, []);

  const getListas = async () => {
    setIsLoading(true);
    const listaResponse = await getListByIdTablero(param2 ? +param2 : 0);
    setListas(listaResponse);
    setIsLoading(false);
  };

  const handleOpen = () => setModalIsOpen(true);
  const handleClose = () => setModalIsOpen(false);

  const handleOpenModalEdit = () => setModalEditIsOpen(true);
  const handleCloseModalEdit = () => setModalEditIsOpen(false);

  const handleNavigate = (id: number) => {};

  const handleDeleteList = async () => {
    setIsLoading(true);
    handleCloseModalEdit();
    const deleteLista = await deleteByIdLista(
      listaSeleccionada ? listaSeleccionada.id_lista : 0
    );
    if (!deleteLista) {
      alert.handleAlert(
        "No se pudo eliminar la lista, intente de nuevo mas tarde",
        3,
        "error"
      );
      setIsLoading(false);
      return;
    }
    getListas();
  };
  const validationSchema = Yup.object({
    listName: Yup.string().max(255).required("Este campo es requerido"),
    listMaxLength: Yup.string().max(255).required("Este campo es requerido"),
  });

  const handleOnSubmit = async () => {
    setIsLoading(true);
    const crearListaResponse = await crearLista({
      id_tablero: param2 ? +param2 : 0,
      estado: "activo",
      max_tareas: +values.listMaxLength,
      nombre_lista: values.listName,
      orden: 1,
    });

    if (!crearListaResponse) {
      handleClose();
      alert.handleAlert(
        "algo salio mal, intente de nuevo mas tarde",
        3,
        "error"
      );
      setIsLoading(false);
      return;
    }
    handleClose();
    setIsLoading(false);
  };

  const {
    values,
    errors,
    touched,
    setErrors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<FormikProps>({
    initialValues: {
      listName: "",
      listMaxLength: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleOnSubmit,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (listas === null) {
    return <Typography>algo salio mal, intente nuevamente</Typography>;
  }
  return (
    <>
      <Modal
        open={modalIsOpen}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">Nueva Lista</Typography>
          <TextField
            error={!!(touched.listName && errors.listName)}
            fullWidth
            helperText={touched.listName && errors.listName}
            label="Nombre"
            name="Nombre"
            onBlur={handleBlur("listName")}
            onChange={handleChange("listName")}
            type="Nombre"
            value={values.listName}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            error={!!(touched.listMaxLength && errors.listMaxLength)}
            fullWidth
            helperText={touched.listMaxLength && errors.listMaxLength}
            label="Cantidad maxima"
            name="listMaxLength"
            onBlur={handleBlur("listMaxLength")}
            onChange={handleChange("listMaxLength")}
            type="text"
            value={values.listMaxLength}
            sx={{ marginBottom: 1 }}
          />

          <Button variant="contained" onClick={() => handleSubmit()} fullWidth>
            Crear
          </Button>
        </Box>
      </Modal>
      <Modal
        open={modalEditIsOpen}
        onClose={handleCloseModalEdit}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">Editar Lista</Typography>
          <TextField
            fullWidth
            label="Nombre"
            name="Nombre"
            onBlur={handleBlur("listName")}
            onChange={handleChange("listName")}
            type="Nombre"
            value={listaSeleccionada ? listaSeleccionada?.nombre_lista : ""}
            sx={{ marginBottom: 1 }}
          />

          <Button
            variant="outlined"
            onClick={handleDeleteList}
            sx={{ mb: 1 }}
            fullWidth
          >
            eliminar
          </Button>
          <Button variant="contained" onClick={() => handleSubmit()} fullWidth>
            actualizar
          </Button>
        </Box>
      </Modal>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        Listas
      </Typography>
      <Button variant="contained" onClick={handleOpen} endIcon={<Add />}>
        Nueva Lista
      </Button>
      <Divider sx={{ marginTop: 5, marginBottom: 5 }} />

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {listas.map((item) => (
                  <TableCell
                    key={item.id_lista}
                    align={"center"}
                    style={{ minWidth: 100 }}
                  >
                    {item.nombre_lista}
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        setListaSeleccionada(item);
                        handleOpenModalEdit();
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[].map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={1}>
                    <TableCell key={1} align={"center"}>
                      'hola'
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

ListPage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

export default ListPage;

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
