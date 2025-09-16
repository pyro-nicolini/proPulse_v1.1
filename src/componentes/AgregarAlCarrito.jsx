import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function AgregarAlCarrito({
  product,
  qty = 1,
  children = "Agregar",
}) {
  const { items, addItem, updateItem } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const notify = (t, ms = 1600) => {
    setMsg(t);
    setTimeout(() => setMsg(""), ms);
  };

  const id_producto = Number(product?.id_producto ?? product?.id);
  const esServicio = product?.tipo === "servicio";
  const esProducto = product?.tipo === "producto";

  const existente = items.find((i) => Number(i.id_producto) === id_producto);

  const stockNum = Number.isFinite(product?.stock)
    ? Number(product.stock)
    : null;
  const enCarrito = Number(existente?.cantidad) || 0;
  const stockDisponible =
    stockNum === null ? null : Math.max(0, stockNum - enCarrito);

  const sinStock =
    esProducto && stockDisponible !== null && stockDisponible <= 0;
  const servicioAgregado = esServicio && !!existente;

  const disabled = busy || sinStock || servicioAgregado;

  const onAdd = async () => {
    if (!user) return notify("Inicia sesión para agregar");
    if (!Number.isFinite(id_producto)) return notify("Producto inválido");
    if (servicioAgregado) return notify("Servicio agregado");
    if (sinStock) return notify("Sin stock");

    const base = Math.max(1, Number(qty) || 1);
    const cantidad = esServicio ? 1 : base;

    const aAgregar =
      esProducto && stockDisponible !== null
        ? Math.min(cantidad, stockDisponible)
        : cantidad;

    if (aAgregar <= 0) return notify("Sin stock disponible");

    setBusy(true);
    try {
      if (existente) {
        await updateItem(existente.id_item, {
          cantidad: Number(existente.cantidad || 1) + aAgregar,
        });
        notify("Cantidad actualizada");
      } else {
        await addItem(id_producto, aAgregar);
        notify(esServicio ? "Servicio agregado" : "Agregado al carrito");
      }
    } catch (e) {
      notify(e?.response?.data?.error || "No se pudo agregar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex gap-1">
        {esProducto && stockNum !== null && (
          <p
          className={`${
            sinStock ? "text-primary" : "text-gray-500"
          } subtitle text-center m-0`}
          >
            {sinStock ? "Sin stock" : `Stock: ${stockDisponible}`}
          </p>
        )}

        <button
          className="btn btn-primary"
          onClick={onAdd}
          disabled={disabled}
          title="Agregar al carrito"
        >
          {busy
            ? "Agregando…"
            : servicioAgregado
            ? "Agregado"
            : sinStock
            ? "Sin stock"
            : `🛒 ${children}`}
        </button>
      </div>
            <div className="flex-col">{msg && <p className="text-white text-center m-0">{msg}</p>}</div>
    </>
  );
}
