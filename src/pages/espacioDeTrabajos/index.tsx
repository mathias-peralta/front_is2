import { getAllUsers, UsuariosResponse } from "@/api/users";
import {
  createWorksPace,
  getAllWorkspaces,
  WorkspaceResponse,
  inactivarEspacio, // Función para inactivar espacios
} from "@/api/workspace";
import WorkspaceLayout from "@/layouts/worspace/layout";
import AlertContext from "@/providers/alertProvider";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Link,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

interface FormikProps {
  workspaceName: string;
}

const HomePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [users, setUsers] = useState<UsuariosResponse[] | null>(null);
  const [workspaceList, setWorkspaceList] = useState<WorkspaceResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const alert = useContext(AlertContext);

  const handleOpen = () => setModalIsOpen(true);
  const handleClose = () => setModalIsOpen(false);

  // Cargar los datos cuando el componente se monte
  useEffect(() => {
    getUsers();
    getWorkspaceList();
  }, []);

  const getWorkspaceList = async () => {
    setIsLoading(true);
    try {
      const workspaceList = await getAllWorkspaces();
      console.log("Espacios de trabajo obtenidos:", workspaceList);
      if (workspaceList) {
        setWorkspaceList(workspaceList);
      } else {
        alert.handleAlert("No se encontraron espacios de trabajo.", 3, "warning");
      }
    } catch (error) {
      console.error("Error al obtener los espacios de trabajo:", error);
      alert.handleAlert("Error al cargar espacios de trabajo", 3, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers();
      if (response) {
        setUsers(response);
      } else {
        alert.handleAlert("No se encontraron usuarios.", 3, "warning");
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      alert.handleAlert("Error al cargar usuarios", 3, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    workspaceName: Yup.string().max(255).required("Este campo es requerido"),
  });

  const handleOnSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await createWorksPace({
        nombre_espacio: values.workspaceName,
        fecha_creacion: new Date(),
        estado_trabajo: "activo",
        propietario: 1,
        descripcion_espacio: "Espacio para realizar tareas",
      });
      if (!response) {
        handleClose();
        alert.handleAlert("Algo salió mal, intente de nuevo más tarde", 3, "error");
      } else {
        alert.handleAlert("Espacio de trabajo creado con éxito", 3, "success");
        handleClose();
        getWorkspaceList(); // Actualizar la lista después de crear un nuevo espacio
      }
    } catch (error) {
      console.error("Error al crear el espacio de trabajo:", error);
      alert.handleAlert("Error al crear espacio de trabajo", 3, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    values,
    errors,
    touched,
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

  const handleInactivar = async (id_espacio: number, id_usuario: number) => {
    try {
      const resultado = await inactivarEspacio(id_espacio, id_usuario);
      if (resultado) {
        alert.handleAlert("Espacio de trabajo inactivado con éxito.", 3, "success");
        getWorkspaceList(); // Actualiza la lista de espacios después de inactivar uno
      } else {
        alert.handleAlert("Error al intentar inactivar el espacio de trabajo.", 3, "error");
      }
    } catch (error) {
      console.error("Error al inactivar espacio de trabajo:", error);
      alert.handleAlert("Error al inactivar el espacio de trabajo", 3, "error");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ my: 2 }}>
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
          <Button variant="contained" onClick={handleOnSubmit} fullWidth>
            Crear
          </Button>
        </Box>
      </Modal>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        Espacio de trabajos
      </Typography>
      <Button variant="contained" onClick={handleOpen} endIcon={<Add />}>
        Nuevo espacio de trabajo
      </Button>
      <Divider sx={{ marginTop: 5, marginBottom: 5 }} />

      <Grid container spacing={2}>
        {workspaceList &&
          workspaceList?.map((workspace, index) => (
            <Grid md={4} xs={12}>
              <Link
                href={"/espacioDeTrabajos/" + workspace.id_espacio}
                sx={{ textDecoration: "none" }}
              >
                <Card sx={{ minHeight: 200, textDecoration: "none" }}>

                  <CardContent>
                    <Box
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    ></Box>

                <Typography variant="h6">{workspace.nombre_espacio}</Typography>
                {workspace.propietario === 2 && (
                  <button onClick={() => handleInactivar(workspace.id_espacio, 1 /* Reemplazar con usuario.id */)}>
                    Inactivar Espacio de Trabajo
                  </button>
                )}
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

HomePage.getLayout = (page: any) => <WorkspaceLayout>{page}</WorkspaceLayout>;

export default HomePage;

const style = {
  position: "absolute" as "absolute",
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

