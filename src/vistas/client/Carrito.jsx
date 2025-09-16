import { useCart } from "../../contexts/CartContext";
import { useEffect, useState } from "react";
import { getProducto } from "../../api/proPulseApi";
import ConfirmarCarrito from "../../componentes/ConfirmarCarrito";

const fmtCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function Carrito() {
  const { items, updateItem, removeItem, totals } = useCart();
  const [productos, setProductos] = useState({});

  useEffect(() => {
    if (!items.length) return;
    const faltantes = items.filter((it) => !(it.id_producto in productos));
    if (!faltantes.length) return;

    (async () => {
      const pares = await Promise.all(
        faltantes.map(async (it) => {
          try {
            const { data } = await getProducto(it.id_producto);
            return [it.id_producto, data ?? null];
          } catch {
            return [it.id_producto, null];
          }
        })
      );
      setProductos((prev) => Object.fromEntries([...Object.entries(prev), ...pares]));
    })();
  }, [items]);

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
    <div className="grid grid-cols-3 bg-black w-full">
      <div></div>
      <div>
        {items.map((it) => {
          const producto = productos[it.id_producto];
          const titulo = producto?.titulo || it.titulo || "Producto";
          const precioBase = it.precio_fijo ?? it.precio_unitario ?? it.precio ?? 0;
          const cantidad = Math.max(1, Number(it.cantidad) || 1);
          const subtotal = precioBase * cantidad;

          const incrementar = () =>
            updateItem(it.id_producto, {
              cantidad: cantidad + 1,
              subtotal: precioBase * (cantidad + 1),
            });

          const decrementar = () =>
            updateItem(it.id_producto, {
              cantidad: Math.max(1, cantidad - 1),
              subtotal: precioBase * Math.max(1, cantidad - 1),
            });

          return (
            <div key={it.id_producto} className="container w-full">
              <div className="card grid grid-cols-3" style={{ maxWidth: "600px" }}>
                <div>
                  <h4>{titulo}</h4>
                  <p>ID: {producto?.id_producto ?? it.id_producto}</p>
                  <p>Precio unitario: {fmtCLP.format(precioBase)} 🛒</p>
                  <p>Subtotal: {fmtCLP.format(subtotal)}</p>
                </div>

                <div>
                  <button onClick={decrementar} disabled={cantidad <= 1}>-</button>
                  <span className="mx-2">{cantidad}</span>
                  <button onClick={incrementar}>+</button>
                </div>

                <div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => removeItem(it.id_producto)}
                  >
                    Eliminar 🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Totales generales */}
        <div className="card mt-4 p-4 text-center">
          <p>Neto: {fmtCLP.format(totals.neto)}</p>
          <p>IVA (19%): {fmtCLP.format(totals.iva)}</p>
          <h3>Total: {fmtCLP.format(totals.total)}</h3>
        <ConfirmarCarrito items={items}/>
        </div>

      </div>
    </div>
  );
}
