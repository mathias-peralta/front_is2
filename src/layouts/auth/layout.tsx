import { Box, Container } from "@mui/material";
import NextLink from "next/link";
interface Props {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: Props) => {
  return (
    <Container maxWidth={"sm"}>
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: "1 1 auto",
        }}
      >
        <Box
          component="header"
          sx={{
            left: 0,
            p: 3,
            position: "fixed",
            top: 0,
            width: "100%",
          }}
        >
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: "inline-flex",
              height: 32,
              width: 100,
            }}
          ></Box>
        </Box>
        {children}
      </Box>
    </Container>
  );
};
export default AuthLayout;
