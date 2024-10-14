import { setUser } from "@/redux/features/userSlice";
import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

export const AccountPopover = (props: any) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      dispatch(setUser(null));
      router.push("/");
    } catch {
      dispatch(setUser(null));
      router.push("/");
    }
    onClose();
  };

  const handleProfile = () => {
    onClose();
    router.push("/profile");
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Mi cuenta</Typography>
        <MenuItem onClick={handleProfile}>Mi perfil</MenuItem>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleSignOut}>Cerrar sesión</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
