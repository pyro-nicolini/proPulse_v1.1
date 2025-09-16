import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import AgregarAlCarrito from "../../componentes/AgregarAlCarrito";
import Resena from "../../componentes/Resena";
import productosDb from "../../api/db.json";

export default function Producto() {
  const { id } = useParams();
  const pid = Number(id);
  useFadeUp();

  const productos = useMemo(
    () =>
      (productosDb?.productos || []).map((p, i) => ({
        ...p,
        id_producto: Number(p.id_producto ?? p.id ?? i + 1),
        titulo: p.titulo ?? `Producto ${i + 1}`,
        precio: Number(p.precio ?? 0),
        url_imagen: p.url_imagen ?? `https://picsum.photos/seed/prod-${i}/800/600`,
        descripcion: p.descripcion ?? "Sin descripción.",
      })),
    []
  );

  // ahora busca solo por id
  const producto = productos.find((p) => p.id_producto === pid) || null;

  const fmtCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

  if (!producto) {
    return (
      <div className="container w-full m-2">
        <div className="card p-3">
          <h4>Producto no encontrado</h4>
          <p>ID solicitado: {pid}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex-col items-center justify-center bg-charcoal">
        <div style={{ maxWidth: "30rem" }} className="card fade-up visible m-1">
          <h4>{producto.titulo}</h4>
          <img
            className="img2 w-full"
            src={producto.url_imagen}
            alt={producto.titulo}
          />
          <h4 className="flex justify-end">{fmtCLP.format(producto.precio)}</h4>
          <p>{producto.descripcion}</p>
          <div>
            <AgregarAlCarrito product={producto} />
          </div>
        </div>
      </div>
      <Resena idProducto={pid} />
    </>
  );
}
