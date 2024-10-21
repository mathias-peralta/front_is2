import { getAllUsers, UsuariosResponse } from "@/api/users";
import { createWorksPace, getAllWorkspaces, WorkspaceResponse } from "@/api/workspace";
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
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [workspaceList, setWorkspaceList] = useState<WorkspaceResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const alert = useContext(AlertContext);

  const userId = 1; // Simulando el ID del usuario logueado. Reemplázalo con el ID real.

  useEffect(() => {
    getUsers();
    getWorkspaceList(userId); // Pasamos el userId para obtener los workspaces
  }, [userId]);

  const getWorkspaceList = async (userId: number) => {
    setIsLoading(true);
    const workspaceList = await getAllWorkspaces(userId); // Llama a getAllWorkspaces con el userId
    setWorkspaceList(workspaceList);
    setIsLoading(false);
  };

  const getUsers = async () => {
    setIsLoading(true);
    const response = await getAllUsers();
    setUsers(response);
    setIsLoading(false);
  };

  const validationSchema = Yup.object({
    workspaceName: Yup.string().max(255).required("Este campo es requerido"),
  });

  const handleOnSubmit = async (values: FormikProps) => {
    try {
      setIsLoading(true);

      const response = await createWorksPace({
        nombre_espacio: values.workspaceName,
        fecha_creacion: new Date(),
        estado_espacio: "activo",
        propietario: userId, // Usa el ID del usuario logueado
        descripcion_espacio: "Espacio para realizar tareas",
        miembros: selectedUsers,
      });

      if (!response) {
        throw new Error("Error al crear el espacio de trabajo");
      }

      handleClose();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert.handleAlert("Algo salió mal, intente de nuevo más tarde", 3, "error");
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

  const handleClose = () => setModalIsOpen(false);
  const handleOpen = () => setModalIsOpen(true);

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
            label="Nombre del espacio"
            name="workspaceName"
            onBlur={handleBlur}
            onChange={handleChange}
            type="text"
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
            SelectProps={{
              multiple: true,
            }}
            value={selectedUsers}
            onChange={(event) => setSelectedUsers(event.target.value as unknown as number[])}
            disabled={isLoading}
          >
            {users &&
              users.map((user, index) => (
                <MenuItem key={index} value={user.id_usuario}>
                  {user.correo_usuario}
                </MenuItem>
              ))}
          </TextField>
          <Button 
            variant="contained" 
            onClick={() => handleSubmit()} 
            fullWidth
          >
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
          workspaceList.map((workspace, index) => (
            <Grid key={index} md={4} xs={12}>
              <Link
                href={"/espacioDeTrabajos/" + workspace.id_espacio}
                sx={{ textDecoration: "none" }}
              >
                <Card sx={{ minHeight: 200, textDecoration: "none" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}></Box>

                    <Typography variant="h6">
                      {workspace.nombre_espacio}
                    </Typography>
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
