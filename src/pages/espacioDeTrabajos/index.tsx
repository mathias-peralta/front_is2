import { getAllUsers, UsuariosResponse } from "@/api/users";
import {
  createWorksPace,
  getAllWorkspaces,
  updateWorkspace,
  WorkspaceResponse,
} from "@/api/workspace";
import WorkspaceLayout from "@/layouts/worspace/layout";
import AlertContext from "@/providers/alertProvider";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

interface FormikProps {
  workspaceName: string;
  userList: UsuariosResponse[];
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const HomePage = () => {
  const theme = useTheme();
  const router = useRouter();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [users, setUsers] = useState<UsuariosResponse[] | null>(null);
  const [workspaceList, setWorkspaceList] = useState<
    WorkspaceResponse[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const alert = useContext(AlertContext);

  const handleOpen = () => setModalIsOpen(true);
  const handleClose = () => setModalIsOpen(false);

  const [personName, setPersonName] = useState<string[]>([]);

  const handleChangeUser = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    console.log({ value });
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    getUsers();
    getWorkspaceList();
  }, []);

  const getWorkspaceList = async () => {
    setIsLoading(true);
    const workspaceList = await getAllWorkspaces();

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

  const handleOnSubmit = async () => {
    console.log({ values });
    return;
    setIsLoading(true);
    const response = await createWorksPace({
      nombre_espacio: values.workspaceName,
      fecha_creacion: new Date(),
      estado_trabajo: "activo",
      propietario: 1, // Actualizar esto para el usuario propietario
      descripcion_espacio: "Espacio para realizar tareas",
    });

    if (!response) {
      handleClose();
      alert.handleAlert(
        "Algo salió mal, intente de nuevo más tarde",
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
    setValues,
    setErrors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<FormikProps>({
    initialValues: {
      workspaceName: "",
      userList: [],
    },
    validationSchema: validationSchema,
    onSubmit: handleOnSubmit,
  });

  const handleNavigate = (id: number) => {
    router.push("/espacioDeTrabajos/[id]", `/espacioDeTrabajos/${id}`);
  };
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleDesactivateWorkSpace = async (id: number) => {
    setIsLoading(true);
    const updateResponse = await updateWorkspace({
      id,
      estado_espacio: "inactivo",
    });

    if (updateResponse) {
      await getWorkspaceList();
    }

    setIsLoading(false);
  };

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
          <FormControl sx={{ marginBottom: 1 }} fullWidth>
            <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={personName}
              onChange={handleChangeUser}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={personName.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              <Card sx={{ minHeight: 200, textDecoration: "none" }}>
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  ></Box>

                  <Typography variant="h6">
                    {workspace.nombre_espacio}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="medium"
                    variant="outlined"
                    onClick={() =>
                      handleDesactivateWorkSpace(workspace.id_espacio)
                    }
                  >
                    Desactivar
                  </Button>
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => handleNavigate(workspace.id_espacio)}
                  >
                    Ingresar
                  </Button>
                </CardActions>
              </Card>
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
