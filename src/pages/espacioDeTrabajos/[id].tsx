import {
  createTableroByWorkspace,
  getTablerosByWorkspace,
  TableroResponse,
} from "@/api/tableros";
import { UsuariosResponse } from "@/api/users";
import HomeLayout from "@/layouts/home/layout";
import AlertContext from "@/providers/alertProvider";
import { Add, ArrowRightAlt } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
interface FormikProps {
  tableroName: string;
}

const HomePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [users, setUsers] = useState<UsuariosResponse[] | null>(null);
  const [tableroList, setTableroList] = useState<TableroResponse[] | null>(
    null
  );
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

  const handleNavigate = (id: number) => {
    router.push(`/tablero/${id}`);
  };

  const validationSchema = Yup.object({
    tableroName: Yup.string().max(255).required("Este campo es requerido"),
  });

  const handleOnSubmit = async () => {
    setIsLoading(true);
    const response = await createTableroByWorkspace({
      id_espacio: id ? +id : 0,
      nombre_tablero: values.tableroName,
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
    await getAllTablerosById();
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
      tableroName: "",
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
  if (tableroList === null) {
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
          <Typography variant="h6">Nuevo tablero</Typography>
          <TextField
            error={!!(touched.tableroName && errors.tableroName)}
            fullWidth
            helperText={touched.tableroName && errors.tableroName}
            label="Nombre"
            name="email"
            onBlur={handleBlur("tableroName")}
            onChange={handleChange("tableroName")}
            type="email"
            value={values.tableroName}
            sx={{ marginBottom: 1 }}
          />

          <Button variant="contained" onClick={() => handleSubmit()} fullWidth>
            Crear
          </Button>
        </Box>
      </Modal>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        Tableros
      </Typography>
      <Button variant="contained" onClick={handleOpen} endIcon={<Add />}>
        Nuevo tablero
      </Button>
      <Divider sx={{ marginTop: 5, marginBottom: 5 }} />
      {tableroList.length > 0 ? (
        <Grid container spacing={2}>
          {tableroList &&
            tableroList?.map((item, index) => (
              <Grid md={4} xs={12}>
                <Card sx={{ minHeight: 200, textDecoration: "none" }}>
                  <CardContent>
                    <Box
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    ></Box>

                    <Typography variant="h6">{item.nombre_tablero}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="medium"
                      variant="contained"
                      onClick={() => handleNavigate(item.id_tablero)}
                      endIcon={<ArrowRightAlt />}
                    >
                      Ingresar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      ) : (
        <Typography>no hay datos</Typography>
      )}
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
