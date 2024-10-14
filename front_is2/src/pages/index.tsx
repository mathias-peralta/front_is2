import HomeLayout from "@/layouts/home/layout";
import { Typography } from "@mui/material";

const HomePage = () => {
  return (
    <>
      <Typography>Hola mundo asdsad adasdsdasdad!</Typography>
    </>
  );
};

HomePage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

export default HomePage;
