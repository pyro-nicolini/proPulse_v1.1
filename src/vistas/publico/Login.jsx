import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import { useAuth } from "../../contexts/AuthContext";

import logoColor1 from "../../assets/img/logos/logo_propulse.svg";
import foto2 from "../../assets/img/ejemplos/nike-running.webp";

const fmtErr = (e) => e?.response?.data?.error || "Credenciales inválidas";

export default function Login() {
  useFadeUp();
  const nav = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "admin@admin", password: "admin@admin" });
  const [form2, setForm2] = useState({ email: "cliente@cliente", password: "cliente@cliente" });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(form);
      nav("/");
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setLoading(false);
    }
  };
  const onSubmit2 = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(form2);
      nav("/");
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-2 fade-up flex-col">
      <div className="grid grid-cols-3 gap-2">
        <div className="card fade-up">
          <div className="flex flex-col items-center gap-1 mb-2">
            <img src={logoColor1} alt="ProPulse" className="png1" />
            <h2 className="text-gradient m-0">Ingresar</h2>
            <p className="subtitle m-0">Bienvenido de vuelta</p>
            <div></div>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-1 w-full">
            <div className="flex flex-col gap-1 mb-1 w-full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input border p-2"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full mb-1">
              <label htmlFor="password">Contraseña</label>
              <div className="flex gap-1 w-full">
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
                  aria-label="Mostrar/Ocultar contraseña"
                >
                  {showPass ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {err && <p className="text-red-600 text-sm">{String(err)}</p>}

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            <p className="text-sm mt-1">
              ¿No tienes cuenta?&nbsp;
              <Link to="/register" className="underline">
                Crear una cuenta
              </Link>
            </p>
          </form>
        </div>
        <div className="card fade-up">
          <div className="flex flex-col items-center gap-1 mb-2">
            <img src={logoColor1} alt="ProPulse" className="png1" />
            <h2 className="text-gradient m-0">Ingresar</h2>
            <p className="subtitle m-0">Bienvenido de vuelta</p>
            <div></div>
          </div>

          <form onSubmit={onSubmit2} className="flex flex-col gap-1 w-full">
            <div className="flex flex-col gap-1 mb-1 w-full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input border p-2"
                placeholder="tu@correo.com"
                value={form2.email}
                onChange={(e) => setForm({ ...form2, email: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full mb-1">
              <label htmlFor="password">Contraseña</label>
              <div className="flex gap-1 w-full">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="input border p-2 flex-1"
                  placeholder="••••••••"
                  value={form2.password}
                  onChange={(e) =>
                    setForm({ ...form2, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label="Mostrar/Ocultar contraseña"
                >
                  {showPass ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {err && <p className="text-red-600 text-sm">{String(err)}</p>}

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            <p className="text-sm mt-1">
              ¿No tienes cuenta?&nbsp;
              <Link to="/register" className="underline">
                Crear una cuenta
              </Link>
            </p>
          </form>
        </div>

        <div
          className="card card-bg-img fade-up text-shadow relative overflow-hidden"
          style={{ backgroundImage: `url(${foto2})` }}
        >
          <div className="relative z-20 flex-col justify-end h-full">
            <h3 className="m-0">Tu progreso, en movimiento</h3>
            <p className="m-0">
              Compra productos y servicios deportivos al instante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
