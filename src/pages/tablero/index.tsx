import { getAllWorkspacesById, WorkspaceResponse } from "@/api/apiWorkspace";
import HomeLayout from "@/layouts/home/layout";
import AlertContext from "@/providers/alertProvider";
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Modal,
  TextField,
  Typography,
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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}
const rows = [createData("Frozen yoghurt", 159, 6.0, 24, 4.0)];
interface FormikProps {
  tableroName: string;
}

const TableroPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceList, setWorkspaceList] = useState<
    WorkspaceResponse[] | null
  >(null);
  const alert = useContext(AlertContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const workspaceList = await getAllWorkspacesById();
    setWorkspaceList(workspaceList);
  };

  const handleModal = () => setModalIsOpen(!modalIsOpen);

  const handleOnSubmit = () => {};

  const validationSchema = Yup.object({
    workspaceName: Yup.string().max(255).required("Este campo es requerido"),
  });

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

  return (
    <>
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
            label="Nombre"
            name="email"
            onBlur={handleBlur("tableroName")}
            onChange={handleChange("tableroName")}
            type="email"
            value={values.tableroName}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            id="outlined-select-currency"
            select
            label="Espacio de trabajo"
            fullWidth
            sx={{ marginBottom: 1 }}
            disabled={isLoading}
          >
            {workspaceList &&
              workspaceList?.map((item, index) => (
                <MenuItem key={index} value={item.id_espacio}>
                  {item.nombre_espacio}
                </MenuItem>
              ))}
          </TextField>
          <Button variant="contained" onClick={handleOnSubmit} fullWidth>
            Crear
          </Button>
        </Box>
      </Modal>
      <Typography variant="body1">Tableros</Typography>
      <Button variant="contained" size="medium" onClick={handleModal}>
        Nuevo tablero
      </Button>

      <Divider sx={{ marginTop: 2 }} />
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Por hacer</TableCell>
              <TableCell align="center">en curso</TableCell>
              <TableCell align="center">en revisión</TableCell>
              <TableCell align="center">Listo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">
                  <Alert severity="warning">
                    Número máximo de tarjetas alcanzados
                  </Alert>
                </TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
