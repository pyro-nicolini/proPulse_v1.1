import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const usuarios = [
  { id: 1, name: "Admin",        email: "admin@admin",      password: "admin@admin", rol: "admin",   fecha_creacion: "2025-09-10T12:00:00Z" },
  { id: 2, name: "Cliente Uno",  email: "cliente@cliente",  password: "cliente@cliente",   rol: "cliente", fecha_creacion: "2025-09-11T12:00:00Z" },
  { id: 3, name: "Cliente Tres",  email: "cliente@cliente2",  password: "cliente@cliente2",   rol: "cliente", fecha_creacion: "2025-09-11T12:00:00Z" },
  { id: 4, name: "Cliente Cuatro",  email: "cliente@cliente3",  password: "cliente@cliente3",   rol: "cliente", fecha_creacion: "2025-09-11T12:00:00Z" },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(usuarios);
  const [user, setUser] = useState(null);
  const [ready] = useState(true);
  const isAdmin = !!user && user.rol === "admin";

  const register = async ({ name, email, password }) => {
    const nombre = String(name || "").trim();
    const correo = String(email || "").trim().toLowerCase();
    const pass = String(password || "");

    if (!nombre || !correo || !pass) {
      throw new Error("Faltan datos: name, email y password son obligatorios.");
    }
    if (users.some(u => u.email.toLowerCase() === correo)) {
      throw new Error("Ese email ya está registrado.");
    }

    const nuevoId =
      users.length ? Math.max(...users.map(u => Number(u.id) || 0)) + 1 : 1;

    const nuevoUsuario = {
      id: nuevoId,
      name: nombre,
      email: correo,
      password: pass,
      rol: "cliente",
      fecha_creacion: new Date().toISOString(),
    };

    setUsers(prev => [...prev, nuevoUsuario]);
    setUser(nuevoUsuario);
    return { user: nuevoUsuario };
  };

  const login = async ({ email, password }) => {
    const correo = String(email || "").trim().toLowerCase();
    const pass = String(password || "");
    const encontrado = users.find(
      u => u.email.toLowerCase() === correo && u.password === pass
    );
    if (!encontrado) {
      throw new Error("Credenciales inválidas.");
    }
    setUser(encontrado);
    return { user: encontrado };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, ready, register, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

