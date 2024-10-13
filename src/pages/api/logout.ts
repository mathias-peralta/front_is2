import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0), // Fecha de expiración en el pasado
      path: "/",
    })
  );

  res.status(200).json({ message: "Token eliminado" });
}
