// src/componentes/Pedidos.jsx
import { useEffect, useState } from "react";
import db from "../../api/db.json";
import { useAuth } from "../../contexts/AuthContext";

function Pedidos() {
  const { user } = useAuth();

  // Fallbacks por si el db.json no trae datos
  const productosArr = Array.isArray(db?.productos) ? db.productos : [
    { id_producto: 1, titulo: "Producto A", precio: 12000 },
    { id_producto: 2, titulo: "Producto B", precio: 35000 },
  ];
  const pedidosArr = Array.isArray(db?.pedidos) ? db.pedidos : [
    { id_pedido: 1, id_usuario: 2, total: 47000, estado: "pagado",   fecha_pedido: "2025-09-14T10:00:00Z" },
    { id_pedido: 2, id_usuario: 2, total: 35000, estado: "pendiente", fecha_pedido: "2025-09-15T12:00:00Z" },
  ];
  const detallesArr = Array.isArray(db?.pedidos_detalle) ? db.pedidos_detalle : [
    { id_detalle: 1, id_pedido: 1, id_producto: 1, cantidad: 1, precio_fijo: 12000, fecha_creacion: "2025-09-14T10:01:00Z" },
    { id_detalle: 2, id_pedido: 1, id_producto: 2, cantidad: 1, precio_fijo: 35000, fecha_creacion: "2025-09-14T10:01:30Z" },
    { id_detalle: 3, id_pedido: 2, id_producto: 2, cantidad: 1, precio_fijo: 35000, fecha_creacion: "2025-09-15T12:01:00Z" },
  ];

  const productosMap = productosArr.reduce((acc, p) => {
    const idp = Number(p.id_producto ?? p.id);
    acc[idp] = { ...p, id_producto: idp, titulo: p.titulo ?? `Producto #${idp}` };
    return acc;
  }, {});

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoId, setPedidoId] = useState(null);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [detalleLoading, setDetalleLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Solo gráficos: filtra por usuario si existe; si no, muestra todo
    const uid = user?.id;
    const lista = uid ? pedidosArr.filter(p => p.id_usuario === uid) : pedidosArr;
    setPedidos(lista);
    setPedidoId(lista[0]?.id_pedido ?? null);
    setLoading(false);
  }, [user?.id]);

  const handleBuscarPedido = (id_pedido) => {
    setDetalleLoading(true);
    const p = pedidosArr.find(x => x.id_pedido === id_pedido);
    const items = detallesArr
      .filter(d => d.id_pedido === id_pedido)
      .map(d => {
        const prod = productosMap[d.id_producto];
        const subtotal = (Number(d.cantidad) || 0) * (Number(d.precio_fijo) || 0);
        return {
          ...d,
          titulo: prod?.titulo ?? `Producto #${d.id_producto}`,
          subtotal,
        };
      });
    setPedidoDetalle(p ? { ...p, items } : null);
    setDetalleLoading(false);
  };

  return (
    <div className="w-full">
      <h2>Mis Pedidos</h2>

      {loading && <p>Cargando…</p>}
      {!loading && !pedidos.length && <p>Sin pedidos.</p>}

      {!!pedidos.length && (
        <table className="w-full container bg-gradient-secondary radius">
          <thead className="card w-full radius">
            <tr className="text-center">
              <th className="p-0">ID Pedido</th>
              <th className="p-0">Fecha</th>
              <th className="p-0">Total</th>
              <th className="p-0">Estado</th>
              <th className="p-0">Ver Detalle</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id_pedido}>
                <td className="bg-white text-black text-center">{pedido.id_pedido}</td>
                <td className="bg-white text-black text-center">
                  {pedido.fecha_pedido?.slice(0, 10)}
                </td>
                <td className="bg-white text-black text-center">
                  ${Number(pedido.total || 0).toLocaleString("es-CL")}
                </td>
                <td className="bg-white text-black text-center">{pedido.estado}</td>
                <td className="bg-white text-black text-center">
                  <button
                    className="btn btn-primary p-0"
                    onClick={() => {
                      setPedidoId(pedido.id_pedido);
                      handleBuscarPedido(pedido.id_pedido);
                    }}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {detalleLoading && <div className="mt-4">Cargando detalle...</div>}

      {pedidoDetalle && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2">Detalle del Pedido #{pedidoDetalle.id_pedido}</h3>
          <div>Estado: {pedidoDetalle.estado}</div>
          <div>Fecha: {pedidoDetalle.fecha_pedido?.slice(0, 10)}</div>
          <div>Total: ${Number(pedidoDetalle.total || 0).toLocaleString("es-CL")}</div>
          <ul className="mt-2">
            {pedidoDetalle.items?.map((item) => (
              <li key={item.id_detalle}>
                {item.titulo || `Producto #${item.id_producto}`} x{item.cantidad} — $
                {Number(item.subtotal || 0).toLocaleString("es-CL")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Pedidos;
