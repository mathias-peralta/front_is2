import { AlertColor } from "@mui/material";
import React, { useState } from "react";

enum AlertStatus {
  None = "NONE",
  Success = "SUCCESS",
  Error = "ERROR",
}
interface AlertContextData {
  alert: AlertStatus;
  alertText: string;
  severity: AlertColor;
  success: (text: string, timeout: number) => void;
  error: (text: string, timeout: number) => void;
  /**
   *
   * @param text texto a mostrar al cliente
   * @param timeout tiempo de duracion, en segundos
   * @param severity tipo de alerta a mostrar al cliente
   */
  handleAlert: (text: string, timeout: number, severity: AlertColor) => void;
  clear: () => void;
}
const AlertContext = React.createContext({} as AlertContextData);
AlertContext.displayName = "AlertContext";

const AlertProvider = ({ children }: { children: React.ReactElement }) => {
  const [alert, setAlert] = useState(AlertStatus.None);
  const [alertText, setAlertText] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");

  const handleSuccess = (text: string, timeout: number) => {
    setAlertText(text);
    setAlert(AlertStatus.Success);
    setTimeout(() => {
      setAlert(AlertStatus.None);
    }, timeout * 1000 || 10000);
  };
  const handleError = (text: string, timeout: number) => {
    setAlertText(text);
    setAlert(AlertStatus.Error);
    setTimeout(() => {
      setAlert(AlertStatus.None);
    }, timeout * 1000 || 10000);
  };

  const handleAlert = (text: string, timeout: number, severity: AlertColor) => {
    setAlertText(text);
    setSeverity(severity);
    setAlert(AlertStatus.Success);
    setTimeout(() => {
      setAlert(AlertStatus.None);
    }, timeout * 1000 || 10000);
  };

  return (
    <AlertContext.Provider
      value={{
        alert: alert,
        alertText: alertText,
        severity: severity,
        success: handleSuccess,
        error: handleError,
        handleAlert: handleAlert,
        clear: () => setAlert(AlertStatus.None),
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export { AlertProvider };
export default AlertContext;
