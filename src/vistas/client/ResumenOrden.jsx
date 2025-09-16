import { useState } from "react";
import { useNavigate } from "react-router-dom";

const pedidoMock = {
  id_pedido: 1,
  items: [
    {
      id_item: 1,
      id_producto: 6,
      titulo: "Mancuernas Ajustables 40kg",
      cantidad: 2,
      subtotal: 50000,
    },
    {
      id_item: 2,
      id_producto: 12,
      titulo: "Banco de Pesas Profesional",
      cantidad: 1,
      subtotal: 120000,
    },
  ],
};

export default function ResumenOrden() {
  const items = pedidoMock.items || [];

  const subtotal = items.reduce((acc, it) => acc + (it.subtotal ?? 0), 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleCheckout = () => {
    setBusy(true);
    setTimeout(() => {
      setMsg("Pedido confirmado ✔️ (mock)");
      setBusy(false);
    }, 1000);
  };

  if (!items.length) return <p>Tu carrito está vacío.</p>;

  return (
    <div className="container w-full">
      <div className="card rounded shadow">
        <h2 className="text-xl font-bold mb-4">Resumen de tu orden</h2>
        <ul className="divide-y">
          {items.map((it) => (
            <li key={it.id_item} className="py-2 flex justify-between">
              <span>
                {it.titulo || `Producto #${it.id_producto}`} x{it.cantidad}
              </span>
              <span>
                ${Number(it.subtotal).toLocaleString("es-CL")}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString("es-CL")}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA (19%)</span>
            <span>${iva.toLocaleString("es-CL")}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toLocaleString("es-CL")}</span>
          </div>
        </div>
        <button
          className="btn btn-primary w-full mt-6"
          onClick={() => {
            navigate("/checkout/orden-finalizada", { state: { order: pedidoMock } });
          }}
          disabled={busy}
        >
          {busy ? "Procesando..." : "Confirmar pedido"}
        </button>
        {msg && <div className="mt-2 text-center text-green-600">{msg}</div>}
      </div>
    </div>
  );
}
