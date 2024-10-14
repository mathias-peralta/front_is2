import { registerUser } from "@/api/auth";
import AuthLayout from "@/layouts/auth/layout";
import AlertContext from "@/providers/alertProvider";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import * as Yup from "yup";

export interface FormikProps {
  email: string;
  name: string;
  lastName: string;
  userPass: string;
  submit: string;
}

const AuthRegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const alert = useContext(AlertContext);

  const handleRegister = async () => {
    try {
      const response = await registerUser({
        apellido_usuario: values.lastName,
        correo_usuario: values.email,
        nombre_usuario: values.name,
        password_usuario: values.userPass,
      });

      if (response) {
        alert.handleAlert("¡Registro exitoso!", 3, "success");
        return router.push("/auth/login");
      }
      alert.handleAlert("algo salio mal :(", 3, "error");
    } catch (err: any) {
      alert.handleAlert("algo salio mal :(", 3, "error");
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Este campo es requerido")
      .max(100, "El maximo es de 100 caracteres"),
    lastName: Yup.string()
      .required("Este campo es requerido")
      .max(100, "El maximo es de 100 caracteres"),
    telefono: Yup.string()
      .min(10, "El minimo es de 10 caracteres")
      .max(10, "El maximo es de 10 caracteres"),
    documento: Yup.string().max(255, "El maximo es de 255 caracteres"),
    email: Yup.string()
      .email("Ingrese un correo valido")
      .max(255, "el maximo es de 255 caracteres")
      .required("Correo es requerido"),
    userPass: Yup.string().max(255).required("Contraseña es requerido"),
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
      email: "",
      name: "",
      lastName: "",
      userPass: "",
      submit: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <>
      <Head>
        <title>Registrate</title>
      </Head>
      <Box
        sx={{
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
              <Typography variant="h4">Registrate</Typography>
              <Typography color="text.secondary" variant="body2">
                Ya tenes cuenta? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Inicia sesión aqui
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} columnGap={2}>
                <TextField
                  error={!!(touched.name && errors.name)}
                  fullWidth
                  required
                  helperText={touched.name && errors.name}
                  label="Nombre"
                  name="name"
                  onBlur={handleBlur("name")}
                  onChange={handleChange("name")}
                  value={values.name}
                />
                <TextField
                  error={!!(touched.lastName && errors.lastName)}
                  fullWidth
                  required
                  helperText={touched.lastName && errors.lastName}
                  label="Apellido"
                  name="lastName"
                  onBlur={handleBlur("lastName")}
                  onChange={handleChange("lastName")}
                  value={values.lastName}
                />

                <TextField
                  error={!!(touched.email && errors.email)}
                  fullWidth
                  required
                  helperText={touched.email && errors.email}
                  label="Correo"
                  name="email"
                  onBlur={handleBlur("email")}
                  onChange={handleChange("email")}
                  type="email"
                  value={values.email}
                />
                <TextField
                  error={!!(touched.userPass && errors.userPass)}
                  fullWidth
                  required
                  helperText={touched.userPass && errors.userPass}
                  label="Contraseña"
                  name="password"
                  onBlur={handleBlur("userPass")}
                  onChange={handleChange("userPass")}
                  type={showPassword ? "text" : "password"}
                  value={values.userPass}
                />
                <FormControlLabel
                  onClick={(value) => setShowPassword(!showPassword)}
                  control={<Checkbox value="remember" color="primary" />}
                  label="Mostrar contraseña"
                />
              </Stack>
              {errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Registrarme
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

AuthRegisterPage.getLayout = (page: any) => <AuthLayout>{page}</AuthLayout>;

export default AuthRegisterPage;
