import HomeLayout from "@/layouts/home/layout";
import { Typography } from "@mui/material";

const TableroPage = () => {
  return <Typography>Tablero</Typography>;
};

export default TableroPage;

TableroPage.getLayout = (page: any) => <HomeLayout>{page}</HomeLayout>;
