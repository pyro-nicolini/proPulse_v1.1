import { useLocation, Link } from "react-router-dom";

export default function ConfirmacionOrden({ mensaje }) {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh]">
      <div className="card rounded shadow p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">
          ¡Pedido confirmado! 🎉
        </h1>
        {order ? (
          <>
            <p className="mb-2">
              Gracias por tu compra. Tu número de pedido es:
            </p>
            <div className="text-lg font-mono mb-4">
              #{order.id_pedido || order.id}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Total pagado: </span>
              <span>${order.total?.toLocaleString("es-CL")}</span>
            </div>
            <ul className="mb-4 divide-y">
              {order.items?.map((it) => (
                <li
                  key={it.id_item || it.id_producto}
                  className="py-1 flex justify-between"
                >
                  <span>{it.titulo || `Producto #${it.id_producto}`}</span>
                  <span>x{it.cantidad}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="mb-4">Tu pedido ha sido registrado correctamente.</p>
          </>
        )}
        <Link to="/" className="btn btn-primary mt-6">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
