import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import LikeButton from "./LikeButton";

export default function Galeria({ items = [], title, routeBase, col = 3 }) {
  const [productos, setProductos] = useState(items);

  useEffect(() => {
    setProductos(items);
  }, [items]);

  const fmtCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

  const handleLikeChange = useCallback((idProducto) => {
    setProductos((prev) =>
      prev.map((p) =>
        Number(p.id_producto ?? p.id) === Number(idProducto)
          ? { ...p, likes_count: (p.likes_count || 0) + 1 }
          : p
      )
    );
  }, []);

  return (
    <div className="p-1 fade-up w-full">
      <h3 className="mb-6">{title}</h3>
      <div
        className={`grid ${
          col === 1
            ? "grid-cols-1"
            : col === 2
            ? "grid-cols-2"
            : col === 3
            ? "grid-cols-3"
            : col === 4
            ? "grid-cols-4"
            : ""
        } gap-3`}
      >
        {productos.map((item) => (
          <div
            key={item.id_producto ?? item.id}
            style={{
              backgroundImage: item.url_imagen ? `url(${item.url_imagen})` : "none",
            }}
            className="card-bg-img parallax"
          >
            <Link to={`${routeBase}/${item.id_producto ?? item.id}`}>
              <h4>{item.titulo}</h4>
              <span className="flex text-center">{item.descripcion}</span>
              <div className="container z-10 flex-col justify-end"></div>
              <h3 className="radius">{fmtCLP.format(item.precio)}</h3>
              <div className="flex flex-col">
                <button className="btn btn-secondary text-white p-1 rounded">
                  Ver Más
                </button>
              </div>
            </Link>
            <LikeButton producto={item} onLikeChange={handleLikeChange} />
          </div>
        ))}
      </div>
    </div>
  );
}
