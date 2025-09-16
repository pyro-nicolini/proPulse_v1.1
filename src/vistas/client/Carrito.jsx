// src/vistas/privado/Carrito.jsx
import { useContext, useState } from "react";
import productosDb from "../../api/db.json";
import ConfirmarCarrito from "../../componentes/ConfirmarCarrito";
import CartContext from "../../contexts/CartContext";

const fmtCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function Carrito() {
  const ctx = useContext(CartContext) || null;
  const usandoCtx = !!(ctx && Array.isArray(ctx.items) && typeof ctx.setItems === "function");

  // Productos → mapa por id normalizado
  const productosArr = Array.isArray(productosDb?.productos) ? productosDb.productos : [];
  const productos = productosArr.reduce((acc, p) => {
    const idp = Number(p.id_producto ?? p.id);
    acc[idp] = { ...p, id_producto: idp, id: idp };
    return acc;
  }, {});

  // Items fijos (mock) si no hay contexto
  const itemsFijos = productosArr.slice(0, 2).map((p, i) => {
    const idp = Number(p.id_producto ?? p.id ?? i + 1);
    return {
      id_item: i + 1,
      id_producto: idp,
      cantidad: i === 0 ? 2 : 1,
      precio_fijo: Number(p.precio ?? 0),
    };
  });
  const [itemsLocal, setItemsLocal] = useState(itemsFijos);

  const items = usandoCtx ? ctx.items : itemsLocal;
  const setItems = usandoCtx ? ctx.setItems : setItemsLocal;

  const totals = items.reduce(
    (acc, it) => {
      acc.neto += (Number(it.cantidad) || 1) * (Number(it.precio_fijo) || 0);
      return acc;
    },
    { neto: 0 }
  );
  totals.iva = Math.round(totals.neto * 0.19);
  totals.total = totals.neto + totals.iva;

  const incrementar = (id_item) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id_item === id_item ? { ...it, cantidad: Number(it.cantidad) + 1 } : it
      )
    );
  };

  const decrementar = (id_item) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id_item === id_item && it.cantidad > 1
          ? { ...it, cantidad: Number(it.cantidad) - 1 }
          : it
      )
    );
  };

  const removeItem = (id_item) => {
    setItems((prev) => prev.filter((it) => it.id_item !== id_item));
  };

  if (!items.length) {
    return (
      <div className="container w-full">
        <div className="card w-full text-center">
          <p>Tu carrito está vacío.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 w-full bg-gray-100">
      <div></div>
      <div className="space-y-4">
        {items.map((it) => {
          const producto = productos[it.id_producto];
          const titulo = producto?.titulo || "Producto sin nombre";
          const precio = Number(it.precio_fijo) || 0;

          return (
            <div key={it.id_item} className="card p-2 grid grid-cols-3 gap-2">
              <div>
                <h4>{titulo}</h4>
                <p>ID: {it.id_producto}</p>
                <p>{fmtCLP.format(precio)} 🛒</p>
              </div>
              <div>
                <button onClick={() => decrementar(it.id_item)}>-</button>
                <span className="px-2">{it.cantidad}</span>
                <button onClick={() => incrementar(it.id_item)}>+</button>
              </div>
              <div>
                <button
                  className="btn btn-secondary"
                  onClick={() => removeItem(it.id_item)}
                >
                  Eliminar 🗑️
                </button>
              </div>
            </div>
          );
        })}
        <ConfirmarCarrito items={items} totals={totals} />
      </div>
    </div>
  );
}
