import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import AddToCartButton from "../../componentes/AgregarAlCarrito";
import Resena from "../../componentes/Resena";
import productosDb from "../../api/db.json";

export default function Servicio() {
  const { id } = useParams();
  const sid = Number(id);
  useFadeUp();

  const servicios = useMemo(
    () =>
      (productosDb?.productos || [])
        .map((p, i) => ({
          ...p,
          id_producto: Number(p.id_producto ?? p.id ?? i + 1),
          tipo: p.tipo ?? "producto",
          titulo: p.titulo ?? `Servicio ${i + 1}`,
          precio: Number(p.precio ?? 0),
          url_imagen: p.url_imagen ?? "",
          descripcion: p.descripcion ?? "Sin descripción.",
        }))
        .filter((p) => String(p.tipo).toLowerCase() === "servicio"),
    []
  );

  const servicio = servicios.find((s) => s.id_producto === sid) || null;

  const fmtCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

  if (!servicio) {
    return (
      <div className="container w-full m-2">
        <div className="card p-3">
          <h4>Servicio no encontrado</h4>
          <p>ID solicitado: {sid}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex-col items-center justify-center bg-charcoal">
        <div style={{ maxWidth: "30rem" }} className="card fade-up visible m-1">
          <h4>{servicio.titulo}</h4>
          <img
            className="img2 w-full"
            src={servicio.url_imagen}
            alt={servicio.titulo}
          />
          <h4 className="flex justify-end">{fmtCLP.format(servicio.precio)}</h4>
          <p>{servicio.descripcion}</p>
          <p className="text-sm opacity-75 mt-1">(Servicio: cantidad fija 1)</p>
          <div>
            <AddToCartButton product={servicio} qty={1} />
          </div>
        </div>
      </div>
      <Resena idProducto={sid} />
    </>
  );
}
