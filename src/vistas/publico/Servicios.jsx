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
          url_imagen: `data:image/jpeg;base64,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`,
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
