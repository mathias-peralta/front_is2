import { getAllUsers, UsuariosResponse } from "@/api/users";
import { getAllWorkspaces, WorkspaceResponse } from "@/api/workspace";
import HomeLayout from "@/layouts/home/layout";
import AlertContext from "@/providers/alertProvider";
import { Box, CircularProgress, Grid, Typography, Card, CardContent } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import router from "next/router";

const HomePage = () => {
  const [workspaceList, setWorkspaceList] = useState<WorkspaceResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const alert = useContext(AlertContext);
  const { id } = router.query; // Obtener el parámetro de la URL

  useEffect(() => {
    getWorkspaceList();
  }, []);

  // Obtener lista de espacios de trabajo
  const getWorkspaceList = async () => {
    setIsLoading(true);
    if (id) {
      const workspaceList = await getAllWorkspaces(Number(id));
      setWorkspaceList(workspaceList);
    }
    setIsLoading(false);
  };

  // Redirigir al usuario a la página de tableros
  const handleWorkspaceClick = (id_espacio: number) => {
    router.push(`/tablero/${id_espacio}`); // Redirige a la página de tableros
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4">Espacios de trabajo</Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {workspaceList?.map((workspace) => (
          <Grid item xs={12} sm={6} md={4} key={workspace.id_espacio}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => handleWorkspaceClick(workspace.id_espacio)}>
              <CardContent>
                <Typography variant="h5">{workspace.nombre_espacio}</Typography>
                <Typography variant="body2">{workspace.descripcion_espacio}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

HomePage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

export default HomePage;
