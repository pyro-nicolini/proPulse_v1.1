import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import { useAuth } from "../../contexts/AuthContext";

import logoColor3 from "../../assets/img/logos/logo_propulse_white.png";
import foto4 from "../../assets/img/ejemplos/run.jpeg";
import Resena from "../../componentes/Resena";

const fmtErr = (e) => e?.response?.data?.error || "Error al registrarse";

export default function Register() {
  useFadeUp();
  const nav = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await register(form);
      nav("/");
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-2 flex-col">
      <div className="grid grid-cols-4 gap-2">
        <div></div>
        <div
          className="card card-bg-img text-shadow relative overflow-hidden"
          style={{ backgroundImage: `url(${foto4})` }}
        >
          <div className="relative z-20 flex-col justify-end">
            <img
              src={logoColor3}
              alt="ProPulse"
              className="png3 bg-gradient-primary"
            />
            <h3 className="m-0">Crea tu cuenta</h3>
            <p className="m-0">Únete y comienza a impulsar tu entrenamiento.</p>
          </div>
        </div>

        <div className="container fade-up">
          <h1 className="text-gradient m-0">Registro</h1>
          <p className="subtitle m-0 text-center">Completa tus datos</p>

          <form onSubmit={onSubmit} className="flex flex-col gap-2 mt-2">
            <div className="flex flex-col gap-1 mb-1 w-full">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                className="input bg-white p-2"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full mb-1">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input border p-2 w-full"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="password">Contraseña</label>
              <div className="flex gap-1">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="input border p-2 flex-1"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {err && <p className="text-red-600 text-sm">{String(err)}</p>}

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <p className="text-sm mt-1">
              ¿Ya tienes cuenta?&nbsp;
              <Link to="/login" className="underline">
                Ingresar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
