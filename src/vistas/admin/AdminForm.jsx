import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const init = {
  titulo: "",
  descripcion: "",
  tipo: "producto",
  stock: 0,
  url_imagen: "",
  precio: 0,
};

export default function AdminForm({ onCreated }) {
  const { user } = useAuth();
  const [f, setF] = useState(init);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const reset = () => setF(init);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (user?.rol !== "admin") return;
    setBusy(true); setMsg("");
    try {
      const payload = {
        ...f,
        stock: f.tipo === "producto" ? Number(f.stock) : null,
        precio: Number(f.precio),
      };
      const p = await crearProducto(payload);
      reset();
      setMsg(`Creado #${p.id_producto}`);
      onCreated?.(p);
    } catch (e2) {
      setMsg(e2?.error || "No se pudo crear");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container glass m-1 p-3">
      <h2 className="mb-2">Crear producto</h2>
      {user?.rol !== "admin" && <p>No autorizado.</p>}
      {user?.rol === "admin" && (
        <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full">
          <label>Título
            <input className="input w-full" value={f.titulo} onChange={(e) => onChange("titulo", e.target.value)} required />
          </label>
          <label>Descripción
            <textarea className="input w-full" rows={3} value={f.descripcion} onChange={(e) => onChange("descripcion", e.target.value)} required />
          </label>
          <div className="flex-col-responsive gap-3 w-full p-1">
            <label>Tipo
              <select className="input w-full" value={f.tipo} onChange={(e) => onChange("tipo", e.target.value)}>
                <option value="producto">producto</option>
                <option value="servicio">servicio</option>
              </select>
            </label>
            <label>Stock
              <input
                type="number" className="input w-full"
                value={f.tipo === "producto" ? f.stock : ""}
                onChange={(e) => onChange("stock", e.target.value)}
                disabled={f.tipo !== "producto"}
              />
            </label>
            <label>Precio
              <input type="number" className="input w-full" value={f.precio} onChange={(e) => onChange("precio", e.target.value)} required />
            </label>
          </div>
          <label>URL imagen
            <input className="input w-full" value={f.url_imagen} onChange={(e) => onChange("url_imagen", e.target.value)} />
          </label>
          <div className="flex gap-2">
            <button className="btn" type="submit" disabled={busy}>Crear</button>
            <button className="btn" type="button" onClick={reset} disabled={busy}>Limpiar</button>
          </div>
          {msg && <p className="text-sm opacity-80">{msg}</p>}
        </form>
      )}
    </div>
  );
}
