import HomeLayout from "@/layouts/home/layout";
import { Typography } from "@mui/material";

const TarjetasPage = () => {
  return <Typography variant="h1">TarjetasPage</Typography>;
};

TarjetasPage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

export default TarjetasPage;
