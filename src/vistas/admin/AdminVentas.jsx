import { useEffect, useState } from "react";
import pedidoDb from "../../api/db.json";
import { useAuth } from "../../contexts/AuthContext";

const fmtCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function AdminVentas() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState(pedidoDb?.pedidos || []);
  const [abiertos, setAbiertos] = useState({}); // { [id_pedido]: detalle[] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargar = () => {
    try {
      setLoading(true);
      setError("");
      const base = Array.isArray(pedidoDb?.pedidos) ? pedidoDb.pedidos : [];
      base.sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido));
      setPedidos(base);
      setAbiertos({});
    } catch {
      setError("No se pudieron cargar los pedidos (mock).");
    } finally {
      setLoading(false);
    }
  };

  const toggleDetalle = (id_pedido) => {
    setAbiertos((prev) => {
      const abierto = prev[id_pedido];
      if (abierto) {
        const next = { ...prev };
        delete next[id_pedido];
        return next;
      }
      const detallesDb = Array.isArray(pedidoDb?.pedidos_detalle)
        ? pedidoDb.pedidos_detalle
        : [];
      const detalles = detallesDb.filter((d) => d.id_pedido === id_pedido);
      const fakeIfEmpty =
        detalles.length > 0
          ? detalles
          : [
              {
                id_detalle: Number(String(id_pedido) + "01"),
                id_pedido,
                id_producto: 999,
                cantidad: 1,
                precio_fijo: 19990,
                fecha_creacion: new Date().toISOString(),
              },
            ];
      return { ...prev, [id_pedido]: fakeIfEmpty };
    });
  };

  useEffect(() => {
    if (user) cargar();
  }, [user?.id]);

  return (
    <div className="glass mt-1">
      <h2 className="mb-2">Ventas (historial)</h2>

      {loading && <p>Cargando…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !pedidos.length && <p>Sin pedidos.</p>}

      <div className="flex flex-col gap-2">
        {pedidos.map((p) => (
          <div key={p.id_pedido} className="border rounded p-2 w-full">
            <div className="flex justify-between w-full items-center">
              <div>
                <p>
                  <b>Pedido #{p.id_pedido}</b> ·{" "}
                  {new Date(p.fecha_pedido).toLocaleString()}
                </p>
                <p>
                  Estado: <b>{p.estado}</b> · Total:{" "}
                  <b>{fmtCLP.format(Number(p.total) || 0)}</b>
                </p>
              </div>
              <button className="btn" onClick={() => toggleDetalle(p.id_pedido)}>
                {abiertos[p.id_pedido] ? "Ocultar detalle" : "Ver detalle"}
              </button>
            </div>

            {abiertos[p.id_pedido] && (
              <div className="card mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-right">Precio</th>
                      <th className="text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abiertos[p.id_pedido].map((d) => {
                      const precio = Number(d.precio_fijo) || 0;
                      const cant = Number(d.cantidad) || 0;
                      const sub = precio * cant;
                      return (
                        <tr key={d.id_detalle}>
                          <td>#{d.id_producto}</td>
                          <td className="text-center">{cant}</td>
                          <td className="text-right">{fmtCLP.format(precio)}</td>
                          <td className="text-right">{fmtCLP.format(sub)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
