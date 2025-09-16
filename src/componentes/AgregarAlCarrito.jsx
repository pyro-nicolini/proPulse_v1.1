import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function AgregarAlCarrito({ product, qty = 1, children = "Agregar" }) {
  const { addItem } = useCart();
  const [busy, setBusy] = useState(false);

  const onAdd = async () => {
    setBusy(true);
    try {
      // construimos el objeto para el carrito
      const nuevo = {
        id_producto: product.id_producto,
        titulo: product.titulo,
        precio_fijo: product.precio || product.precio_fijo || 0,
        cantidad: qty,
        subtotal: (product.precio || product.precio_fijo || 0) * qty,
      };
      await addItem(nuevo);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-1">
      <button
        className="btn btn-primary"
        onClick={onAdd}
        disabled={busy}
        title="Agregar al carrito"
      >
        {busy ? "Agregando…" : `🛒 ${children}`}
      </button>
    </div>
  );
}
