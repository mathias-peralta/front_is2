import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, Typography } from "@mui/material";

interface Props {
  onClick: () => void;
}

const ErrorApi = ({ onClick }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 3,
        alignContent: "center",
        minHeight: "200px",
        alignItems: "center",
      }}
    >
      <Box>
        <img
          alt="Under development"
          src="/assets/errors/error-404.png"
          style={{
            display: "inline-block",
            maxWidth: 150,
            maxHeight: 150,
          }}
        />
        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
          Algo salió mal
        </Typography>
        <Button
          fullWidth
          endIcon={<RefreshIcon />}
          variant="outlined"
          onClick={onClick}
        >
          Reintentar
        </Button>
      </Box>
    </Box>
  );
};
export default ErrorApi;
