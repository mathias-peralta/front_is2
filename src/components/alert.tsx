import AlertContext from "@/providers/alertProvider";
import Alert from "@mui/material/Alert";
import { useContext } from "react";
const AppAlert = () => {
  const alert = useContext(AlertContext);
  if (alert.alert !== "NONE") {
    return (
      <Alert
        onClose={() => alert.clear()}
        variant="standard"
        style={{
          position: "fixed",
          top: "74px",
          width: "90%",
          marginLeft: "5%",
          marginRight: "5%",
          animation: 1,
          zIndex: 1000,
        }}
        severity={alert.severity}
      >
        {alert.alertText}
      </Alert>
    );
  } else {
    return <></>;
  }
};

export default AppAlert;
