import { getUserById } from "@/api/apiUsers";
import AuthLayout from "@/layouts/auth/layout";
import AlertContext from "@/providers/alertProvider";
import { setToken } from "@/redux/features/authSlice";
import { setUser } from "@/redux/features/userSlice";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
interface FormikProps {
  emailUser: string;
  password: string;
  submit: string | null;
}

const AuthLoginPage = (params: any) => {
  const router = useRouter();
  const alert = useContext(AlertContext);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/login", {
        correo_usuario: values.emailUser,
        password_usuario: values.password,
      });

      if (response.status !== 200) throw new Error("Error en el login");

      const decoded = jwtDecode<any>(response.data.token);
      const userData = await getUserById(decoded?.userId);

      if (!userData) throw new Error("Error al obtener datos del usuario");

      dispatch(setToken(response.data.token));
      dispatch(
        setUser({
          user: userData,
        })
      );

      // Redirigir al home
      router.push("/espacioDeTrabajos");
    } catch (error) {
      // Mostrar un mensaje de error en caso de que el login falle
      alert.handleAlert(
        "algo salio mal, intente de nuevo mas tarde",
        3,
        "error"
      );
    }
  };

  const validationSchema = Yup.object({
    emailUser: Yup.string()
      .email("Ingrese un correo valido")
      .max(255)
      .required("Correo es requerido"),
    password: Yup.string().max(255).required("Contraseña es requerido"),
  });
  const {
    values,
    errors,
    touched,
    setErrors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<FormikProps>({
    initialValues: {
      emailUser: "mathias@fpuna.edu.py",
      password: "holamundo",
      submit: null,
    },
    validationSchema: validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <Head>
        <title>Iniciar sesión</title>
      </Head>

      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Iniciar sesión</Typography>
              <Typography color="text.secondary" variant="body2">
                Aún no tienes una cuenta? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Registrate aquí
                </Link>
              </Typography>
            </Stack>
            <div>
              <Stack spacing={3}>
                <TextField
                  error={!!(touched.emailUser && errors.emailUser)}
                  fullWidth
                  helperText={touched.emailUser && errors.emailUser}
                  label="Correo"
                  name="email"
                  onBlur={handleBlur("emailUser")}
                  onChange={handleChange("emailUser")}
                  type="email"
                  disabled={loading}
                  value={values.emailUser}
                />
                <TextField
                  error={!!(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Contraseña"
                  name="password"
                  onBlur={handleBlur("password")}
                  onChange={handleChange("password")}
                  onKeyDown={(event) =>
                    event.key === "Enter" ? handleSubmit() : undefined
                  }
                  type={showPassword ? "text" : "password"}
                  disabled={loading}
                  value={values.password}
                />
              </Stack>
              {errors.submit && (
                <Typography color="error" sx={{ mt: 1 }} variant="body2">
                  {errors.submit}
                </Typography>
              )}
              <FormControlLabel
                onClick={(value) => setShowPassword(!showPassword)}
                control={<Checkbox value="remember" color="primary" />}
                label="Mostrar contraseña"
              />
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                onClick={() => handleSubmit()}
              >
                Ingresar
              </Button>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

AuthLoginPage.getLayout = (page: any) => <AuthLayout>{page}</AuthLayout>;

export default AuthLoginPage;
