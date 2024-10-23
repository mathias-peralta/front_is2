import { getTablerosByWorkspace } from "@/api/tableros";
import { UsuariosResponse } from "@/api/users";
import { createWorksPace } from "@/api/workspace";
import HomeLayout from "@/layouts/home/layout";
import AlertContext from "@/providers/alertProvider";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
interface FormikProps {
  workspaceName: string;
}

const HomePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [users, setUsers] = useState<UsuariosResponse[] | null>(null);
  const [tableroList, setTableroList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = () => setModalIsOpen(true);
  const handleClose = () => setModalIsOpen(false);
  const alert = useContext(AlertContext);
  const { id } = router.query; // `id` es el parámetro dinámico que obtienes de la URL

  useEffect(() => {
    getAllTablerosById();
  }, []);

  const getAllTablerosById = async () => {
    setIsLoading(true);
    const tableroResponse = await getTablerosByWorkspace(id ? +id : 0);
    setTableroList(tableroResponse);
    setIsLoading(false);
  };

  const validationSchema = Yup.object({
    workspaceName: Yup.string().max(255).required("Este campo es requerido"),
  });

  const handleOnSubmit = async () => {
    setIsLoading(true);
    const response = await createWorksPace({
      nombre_espacio: values.workspaceName,
      fecha_creacion: new Date(),
      estado_trabajo: "activo",
      propietario: 1,
      descripcion_espacio: "Espacio para realizar tareas",
    });
    if (!response) {
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
      workspaceName: "",
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
  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        Tableros
      </Typography>
      <Button variant="contained" onClick={handleOpen} endIcon={<Add />}>
        Nuevo tablero
      </Button>
      <Divider sx={{ marginTop: 5, marginBottom: 5 }} />
    </>
  );
};

HomePage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

export default HomePage;

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
