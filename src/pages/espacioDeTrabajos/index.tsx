import { getAllUsers, UsuariosResponse } from "@/api/users";
import HomeLayout from "@/layouts/home/layout";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

interface FormikProps {
  workspaceName: string;
}
const currencies = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "EUR",
    label: "€",
  },
  {
    value: "BTC",
    label: "฿",
  },
  {
    value: "JPY",
    label: "¥",
  },
];
const HomePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [users, setUsers] = useState<UsuariosResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = () => setModalIsOpen(true);
  const handleClose = () => setModalIsOpen(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setIsLoading(true);
    const response = await getAllUsers();
    setUsers(response);
    setIsLoading(false);

    console.log(response);
  };
  const validationSchema = Yup.object({
    emailUser: Yup.string()
      .email("Ingrese un correo valido")
      .max(255)
      .required("Correo es requerido"),
    password: Yup.string().max(255).required("Contraseña es requerido"),
  });

  const handleOnSubmit = () => {};

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

  return (
    <>
      <Modal
        open={modalIsOpen}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">Nuevo espacio de trabajo</Typography>
          <TextField
            error={!!(touched.workspaceName && errors.workspaceName)}
            fullWidth
            helperText={touched.workspaceName && errors.workspaceName}
            label="Nombre"
            name="email"
            onBlur={handleBlur("workspaceName")}
            onChange={handleChange("workspaceName")}
            type="email"
            value={values.workspaceName}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            id="outlined-select-currency"
            select
            label="Integrantes"
            helperText="Por favor selecciona a los usuarios"
            fullWidth
            sx={{ marginBottom: 1 }}
            disabled={isLoading}
          >
            {users &&
              users?.map((user, index) => (
                <MenuItem key={index} value={user.id_usuario}>
                  {user.correo_usuario}
                </MenuItem>
              ))}
          </TextField>
          <Button variant="contained" onClick={handleOpen} fullWidth>
            Crear
          </Button>
        </Box>
      </Modal>
      <Typography>Espacio de trabajos</Typography>
      <Button variant="contained" onClick={handleOpen} endIcon={<Add />}>
        Crear espacio de trabajo
      </Button>
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
