import HomeLayout from "@/layouts/home/layout";
import { Typography } from "@mui/material";

const DashboardPage = () => {
  return <Typography variant="h1">Dashboard</Typography>;
};

DashboardPage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;

export default DashboardPage;
