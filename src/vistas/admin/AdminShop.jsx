// src/vistas/admin/AdminShop.jsx
import { useState } from "react";
import productoDb from "../../api/db.json";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminShop() {
  const { user } = useAuth();
  const listaFija = (productoDb?.productos || [])
    .slice(0, 6)
    .map((n) => ({ ...n, id_producto: n.id_producto ?? n.id }));

  const [lista] = useState(listaFija);
  const [q] = useState("");

  return (
    <div className="container glass p-1 w-full mt-1">
      <h2 className="mb-2">Admin Shop</h2>
      {user?.rol !== "admin" && <p>No autorizado.</p>}

      {user?.rol === "admin" && (
        <>
          <div className="grid-col-1 grid gap-3 w-full">
            <input
              value={q}
              placeholder="Buscar por título…"
              className="input flex-1"
              disabled
            />
            <button className="btn" disabled>
              Buscar
            </button>
          </div>

          <div className="grid-col-1 grid w-full p-1">
            {lista.map((p) => (
              <div key={p.id_producto} className="card p-2 bg-black radius">
                <div className="grid-col-1 grid gap-3 items-start">
                  <img
                    src={p.url_imagen}
                    width={72}
                    height={48}
                    alt=""
                    className="rounded"
                  />

                  <div className="flex-1">
                    <input
                      className="input w-full"
                      value={p.titulo ?? ""}
                      disabled
                    />

                    <div className="grid-col-1 grid gap-3 mt-1">
                      <label>
                        Precio
                        <input
                          type="number"
                          className="input ml-1 w-28"
                          value={Number(p.precio ?? 0)}
                          disabled
                        />
                      </label>

                      <label>
                        Stock
                        <input
                          type="number"
                          className="input ml-1 w-20"
                          disabled
                          value={p.tipo === "producto" ? Number(p.stock ?? 0) : ""}
                        />
                      </label>

                      <label className="grid-col-1 grid items-center gap-1">
                        <input type="checkbox" checked={!!p.destacado} disabled />{" "}
                        Destacado
                      </label>

                      <label className="grid-col-1 grid items-center gap-1">
                        <input type="checkbox" checked={!!p.activo} disabled />{" "}
                        Activo
                      </label>
                    </div>
                  </div>

                  <div className="grid-col-1 grid gap-3 w-full">
                    <button className="btn" disabled>
                      Guardar
                    </button>
                    <button className="btn danger" disabled>
                      Borrar
                    </button>
                  </div>
                </div>

                <p className="text-sm opacity-75 mt-1">
                  #{p.id_producto} · {p.tipo} · likes: {p.likes_count ?? 0}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
