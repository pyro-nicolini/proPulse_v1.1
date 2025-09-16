import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const carrito = [
  { id_carrito: 1, id_usuario: 2, estado: "abierto", fecha_creacion: "2025-09-13T09:00:00Z" },
];
const carrito_detalle = [
  { id_item: 1, id_carrito: 1, id_producto: 6, precio_fijo: 25000, cantidad: 3, subtotal: 75000, fecha_creacion: "2025-09-13T09:05:00Z" },
  { id_item: 2, id_carrito: 1, id_producto: 17, precio_fijo: 40000, cantidad: 1, subtotal: 40000, fecha_creacion: "2025-09-13T09:06:00Z" },
];
const pedidos = [
  { id_pedido: 1, id_usuario: 2, total: 350000, estado: "pagado", fecha_pedido: "2025-09-14T10:00:00Z" },
  { id_pedido: 2, id_usuario: 2, total: 67000, estado: "pendiente", fecha_pedido: "2025-09-14T12:00:00Z" },
  { id_pedido: 3, id_usuario: 3, total: 210000, estado: "pendiente", fecha_pedido: "2025-09-14T16:00:00Z" },
];
const pedidos_detalle = [
  { id_detalle: 1, id_pedido: 1, id_producto: 1, cantidad: 1, precio_fijo: 180000, fecha_creacion: "2025-09-14T10:01:00Z" },
  { id_detalle: 2, id_pedido: 1, id_producto: 3, cantidad: 2, precio_fijo: 85000, fecha_creacion: "2025-09-14T10:01:30Z" },
  { id_detalle: 3, id_pedido: 2, id_producto: 11, cantidad: 1, precio_fijo: 35000, fecha_creacion: "2025-09-14T12:01:00Z" },
  { id_detalle: 4, id_pedido: 2, id_producto: 7, cantidad: 1, precio_fijo: 32000, fecha_creacion: "2025-09-14T12:01:30Z" },
  { id_detalle: 5, id_pedido: 3, id_producto: 2, cantidad: 1, precio_fijo: 120000, fecha_creacion: "2025-09-14T16:01:00Z" },
  { id_detalle: 6, id_pedido: 3, id_producto: 14, cantidad: 1, precio_fijo: 90000, fecha_creacion: "2025-09-14T16:01:30Z" },
];

const cartId = carrito[0]?.id_carrito ?? 1;

export function CartProvider({ children }) {
  const [items, setItems] = useState(
    carrito_detalle.filter((i) => i.id_carrito === cartId)
  );
  const loading = false;
  const error = "";

  const totals = useMemo(() => {
    const neto = items.reduce(
      (s, it) => s + (Number(it.precio_fijo) * Number(it.cantidad) || 0),
      0
    );
    const iva = Math.round(neto * 0.19);
    const total = neto + iva;
    return { neto, iva, total };
  }, [items]);

  const itemsCount = useMemo(
    () => items.reduce((s, it) => s + (Number(it.cantidad) || 0), 0),
    [items]
  );

  // 🔧 Fix: si el producto ya existe, solo suma cantidad
  const addItem = (nuevo) => {
    setItems((prev) => {
      const existe = prev.find((it) => it.id_producto === nuevo.id_producto);
      if (existe) {
        return prev.map((it) =>
          it.id_producto === nuevo.id_producto
            ? {
                ...it,
                cantidad: it.cantidad + (nuevo.cantidad || 1),
                subtotal: it.precio_fijo * (it.cantidad + (nuevo.cantidad || 1)),
              }
            : it
        );
      }
      return [...prev, { ...nuevo, cantidad: nuevo.cantidad || 1, subtotal: (nuevo.precio_fijo || 0) * (nuevo.cantidad || 1) }];
    });
  };

  const updateItem = (id_producto, cambios) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id_producto === id_producto ? { ...it, ...cambios } : it
      )
    );
  };

  const removeItem = (id_producto) => {
    setItems((prev) => prev.filter((it) => it.id_producto !== id_producto));
  };

  const checkout = () => {
    setItems([]);
    return { ok: true, message: "Checkout simulado" };
  };

  const reload = () => {};

  const value = {
    cartId,
    items,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    checkout,
    reload,
    totals,
    itemsCount,
    setItems,
    carrito,
    carrito_detalle,
    pedidos,
    pedidos_detalle,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
