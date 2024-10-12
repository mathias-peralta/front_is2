import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  console.log({ token });
  // Evitar redirección en rutas de autenticación o recursos estáticos
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url)); // Redirigir si no hay token
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // Excluir rutas de autenticación
};
