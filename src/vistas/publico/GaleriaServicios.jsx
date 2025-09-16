import { useEffect, useState } from "react";
import { useFadeUp } from "../../customHooks/useFadeUp";
import Galeria from "../../componentes/Galeria";
import Destacados from "../../componentes/Destacados";
import productosDb from "../../api/db.json"


export default function GaleriaServicios() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    setServicios(productosDb.productos.filter((p) => p.tipo === "servicio"));
  }, []);

  useFadeUp();


  const desordenarArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const serviciosBarajados = desordenarArray(servicios).slice(0, 6);
  return (
    <>
      <div className="w-full container-1200 min-h-screen">
        <Galeria
          items={serviciosBarajados}
          title="Servicios"
          routeBase="/servicios"
          col={3}
        />
        <Destacados
          title="Destacados"
          col={3}
          routeBase="/servicios"
          cant={3}
          tipoProducto="servicio"
        />
      </div>
    </>
  );
}
