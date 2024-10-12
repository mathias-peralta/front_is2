import API from "@/config/API";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

interface LoginResponse {
  token: string;
  message: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { correo_usuario, password_usuario } = req.body;
    const loginReques = await API.post<LoginResponse>("/api/auth/login", {
      correo_usuario,
      password_usuario,
    });
    if (loginReques.status !== 200) {
      return res
        .status(loginReques.status)
        .json({ message: "algo salio mal!" });
    }
    // Generar token (ejemplo con token falso)
    const token = "fake-jwt-token";

    // Configurar la cookie con el token
    res.setHeader(
      "Set-Cookie",
      serialize("token", loginReques.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // Expira en 1 semana
        path: "/",
      })
    );
    return res.status(200).json({ message: "Login exitoso" });
  } catch {
    return res.status(500).json({ error: "Error en el login" });
  }
}
