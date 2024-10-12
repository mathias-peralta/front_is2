import { stringAvatar } from "@/helpers/utils";
import { usePopover } from "@/hooks/usePopover";
import { setUser } from "@/redux/features/userSlice";
import { useAppSelector } from "@/redux/hooks";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/solid/ArrowLeftOnRectangleIcon";
import HomeIcon from "@heroicons/react/24/solid/HomeIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import TicketIcon from "@heroicons/react/24/solid/TicketIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import MenuIcon from "@mui/icons-material/Menu";
import StadiumIcon from "@mui/icons-material/Stadium";
import { Avatar, Button, Container, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AccountPopover } from "./accountPopover";
interface Props {
  window?: () => Window;
  children: React.ReactNode;
}

const drawerWidth = 240;
const navItems = ["Iniciar sesión", "Registrarme"];

const NavBarComponent = (props: Props) => {
  const { window, children } = props;
  const user = useAppSelector((state) => state.userState.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const accountPopover = usePopover();
  const dispatch = useDispatch();

  const handleProfile = () => router.push("/profile");

  const handleOnPress = () => router.push("/");

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //setAuth(event.target.checked);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      dispatch(setUser(null));
      router.replace("/");
    } catch {
      dispatch(setUser(null));
      router.replace("/");
    }
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "left" }}>
      <Box sx={{ pl: 2 }}></Box>
      <Divider />
      <List>
        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => router.push("/")}
                sx={{ textAlign: "start" }}
              >
                <HomeIcon width={20} height={20} />
                <ListItemText primary="Inicio" sx={{ marginLeft: 1 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleProfile}
                sx={{ textAlign: "start" }}
              >
                <UserIcon width={20} height={20} />
                <ListItemText primary="Mi perfil" sx={{ marginLeft: 1 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleOnPress}
                sx={{ textAlign: "start" }}
              >
                <TicketIcon width={20} height={20} />
                <ListItemText primary="" sx={{ marginLeft: 1 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleSignOut}
                sx={{ textAlign: "start" }}
              >
                <ArrowLeftOnRectangleIcon width={20} height={20} />
                <ListItemText primary="Cerrar sesión" sx={{ marginLeft: 1 }} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => router.push("/auth/login")}
                sx={{ textAlign: "start" }}
              >
                <LockClosedIcon width={20} height={20} />
                <ListItemText primary="Iniciar sesión" sx={{ marginLeft: 1 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => router.push("/auth/register")}
                sx={{ textAlign: "start" }}
              >
                <UserPlusIcon width={20} height={20} />
                <ListItemText primary="Registrarme" sx={{ marginLeft: 1 }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "primary.light",
        }}
      >
        <Container>
          <Toolbar>
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
              <Box
                // component={NextLink}
                // href="/"
                sx={{
                  display: "inline-flex",
                  height: 32,
                  width: 100,
                }}
                onClick={() => router.replace("/")}
              ></Box>
            </Box>
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "end",
                width: "100%",
              }}
            >
              {user && (
                <Typography color="black">Bienvenido, {"MA"}</Typography>
              )}
            </Box>
            {user ? (
              <Box
                sx={{
                  display: { xs: "none", sm: "contents" },
                }}
              >
                <IconButton size="large" onClick={() => router.push("/")}>
                  <StadiumIcon color="primary" sx={{ mr: 1 }} />
                  <Typography sx={{ color: "black" }}>Eventos</Typography>
                </IconButton>
                <IconButton size="large" onClick={handleOnPress}>
                  <ConfirmationNumberIcon color="primary" sx={{ mr: 1 }} />
                  <Typography sx={{ color: "black" }}>prueba</Typography>
                </IconButton>
                <Avatar
                  {...stringAvatar("MA")}
                  onClick={accountPopover.handleOpen}
                  ref={accountPopover.anchorRef}
                  sx={{
                    cursor: "pointer",
                    height: 40,
                    width: 40,
                    background: "red",
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button onClick={() => router.push("/auth/login")}>
                  Iniciar sesión
                </Button>
                <Button
                  onClick={() => router.push("/auth/register")}
                  variant="contained"
                >
                  Registrarme
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <AccountPopover
          anchorEl={accountPopover.anchorRef.current}
          open={accountPopover.open}
          onClose={accountPopover.handleClose}
        />
      </Box>
      <Box component="main" sx={{ width: "100%" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
export default NavBarComponent;
