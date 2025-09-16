import { use, useEffect, useState } from "react";
import { useFadeUp } from "../../customHooks/useFadeUp";
import Galeria from "../../componentes/Galeria";
import productosDb from "../../api/db.json"
import Destacados from "../../componentes/Destacados";

export default function GaleriaProductos() {
  const [productos, setProductos] = useState(productosDb.productos);
  useFadeUp();

  const desordenarArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const productosBarajados = desordenarArray(productos).slice(0, 6);
  return (
    <>
      <div className="w-full min-h-screen bg-charcoal">
        <Galeria
          items={productosBarajados}
          title="Productos"
          routeBase="/productos"
          col={3}
        />
        <Destacados
          title="Destacados"
          col={3}
          routeBase="/productos"
          cant={3}
          tipoProducto="producto"
        />
      </div>
    </>
  );
}
