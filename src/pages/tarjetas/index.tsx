import { createNewActivity } from "@/api/apiActividades";
import { getListByIdTablero } from "@/api/apiListas";
import { getUsersByWorkspaceId } from "@/api/apiWorkspace";
import HomeLayout from "@/layouts/home/layout";
import { ListasByIDTableroResponse } from "@/models/response/listaResponse";
import { UsersByWorkspaceIDResponse } from "@/models/response/workspaceResponse";
import AlertContext from "@/providers/alertProvider";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

interface FormikProps {
  activityName: string;
  description: string;
  dateEnd: string;
  user: UsersByWorkspaceIDResponse | null;
  idLista: string;
}

const TarjetasPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setusers] = useState<UsersByWorkspaceIDResponse[] | null>(null);
  const [listas, setListas] = useState<ListasByIDTableroResponse[] | null>(
    null
  );
  const alert = useContext(AlertContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const usersList = await getUsersByWorkspaceId(53);
    const listasResponse = await getListByIdTablero(5);
    setListas(listasResponse);
    setusers(usersList);
  };

  const handleModal = () => setModalIsOpen(!modalIsOpen);

  const handleOnSubmit = async () => {
    handleModal();
    setIsLoading(true);
    const crearNuevaTarjeta = await createNewActivity({
      id_lista: +values.idLista,
      usuario_asignado: values.user?.id_usuario || 0,
      fecha_vencimiento: new Date(values.dateEnd),
      fecha_creacion: new Date(),
      descripcion_tarjeta: values.description,
      titulo_tarjeta: values.activityName,
    });
    setIsLoading(false);

    if (!crearNuevaTarjeta) {
      alert.handleAlert("Error al crear la actividad", 3, "error");
      return;
    }
  };

  const validationSchema = Yup.object({
    activityName: Yup.string().max(255).required("Este campo es requerido"),
    description: Yup.string().max(255).required("Este campo es requerido"),
    dateEnd: Yup.date().required("Este campo es requerido"),
    isLista: Yup.string().max(255).required("Este campo es requerido"),
  });

  const {
    values,
    errors,
    touched,
    setValues,
    setErrors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<FormikProps>({
    initialValues: {
      activityName: "",
      description: "",
      dateEnd: "",
      user: null,
      idLista: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleOnSubmit,
  });

  return (
    <>
      <Modal
        open={modalIsOpen}
        onClose={handleModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">Crear nueva actividad</Typography>
          <TextField
            error={!!(touched.activityName && errors.activityName)}
            fullWidth
            helperText={touched.activityName && errors.activityName}
            label="Nombre"
            name="email"
            onBlur={handleBlur("activityName")}
            onChange={handleChange("activityName")}
            type="email"
            value={values.activityName}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            error={!!(touched.description && errors.description)}
            fullWidth
            helperText={touched.description && errors.description}
            label="Descripcion"
            onBlur={handleBlur("description")}
            onChange={handleChange("description")}
            type="text"
            value={values.description}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            error={!!(touched.dateEnd && errors.dateEnd)}
            fullWidth
            helperText={touched.dateEnd && errors.dateEnd}
            label="Fecha fin"
            onBlur={handleBlur("dateEnd")}
            onChange={handleChange("dateEnd")}
            type="date"
            value={values.dateEnd}
            sx={{ marginBottom: 1 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 1 }}>
            <InputLabel id="demo-simple-select-label">
              Seleccionar usuario
            </InputLabel>
            <Select
              error={!!(touched.user && errors.user)}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.user?.id_usuario}
              label="usuario"
            >
              {users?.map((user) => (
                <MenuItem
                  key={user.id_usuario}
                  value={user.id_usuario}
                  onClick={() => setValues({ ...values, user })}
                >
                  {user.correo_usuario}
                </MenuItem>
              )) || <MenuItem>No hay usuarios</MenuItem>}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 1 }}>
            <InputLabel id="demo-simple-select-label">
              Seleccionar estado
            </InputLabel>
            <Select
              error={!!(touched.idLista && errors.idLista)}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.user?.id_usuario}
              label="usuario"
            >
              {listas?.map((item) => (
                <MenuItem
                  key={item.id_lista}
                  value={item.id_lista}
                  onClick={() =>
                    setValues({ ...values, idLista: item.id_lista.toString() })
                  }
                >
                  {item.id_lista}
                </MenuItem>
              )) || <MenuItem>No hay actividades</MenuItem>}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleOnSubmit} fullWidth>
            Crear
          </Button>
        </Box>
      </Modal>
      <Typography variant="body1">Actividades</Typography>
      <Button variant="contained" size="medium" onClick={handleModal}>
        Nueva actividad
      </Button>

      <Divider sx={{ marginTop: 2 }} />
    </>
  );
};

export default TarjetasPage;

TarjetasPage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

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
