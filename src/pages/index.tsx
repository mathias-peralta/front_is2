import HomeLayout from "@/layouts/home/layout";
import { Typography } from "@mui/material";

const HomePage = () => {
  return (
    <>
      <Typography>Bienvenido a TaskFlow</Typography>
    </>
  );
};

HomePage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

export default HomePage;
