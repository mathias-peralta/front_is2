import HomeLayout from "@/layouts/home/layout";
import { Typography } from "@mui/material";

const HomePage = () => {
  return (
    <>
      <Typography>Gestión de Tareas</Typography>
    </>
  );
};

HomePage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

export default HomePage;
