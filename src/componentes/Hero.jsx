import { useState, useEffect } from "react";
import productosDb from "../api/db.json";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productos = productosDb.productos || [];
  const destacados = productos.filter((p) => p.destacado);

  const goToNext = () =>
    setCurrentIndex((i) => (i === destacados.length - 1 ? 0 : i + 1));

  const goToPrev = () =>
    setCurrentIndex((i) => (i === 0 ? destacados.length - 1 : i - 1));

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [destacados.length]);

  const formatPrice = (precio) =>
    precio ? `$${Number(precio).toLocaleString("es-CL")}` : "";

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="carousel-container">
        <div className="carousel-wrapper">
          {destacados.map((slide, index) => (
            <div
              key={slide.id_producto}
              className={`carousel-slide ${
                index === currentIndex
                  ? "active"
                  : index < currentIndex
                  ? "prev"
                  : "next"
              }`}
              style={{ backgroundImage: `url(${slide.url_imagen})` }}
            >
              <div className="slide-content">
                <h3 className="slide-title">{slide.titulo}</h3>
                <p className="slide-description">{slide.descripcion}</p>
                <div className="slide-price">{formatPrice(slide.precio)}</div>
                <div className="slide-buttons">
                  <button className="btn btn-primary">Ver más detalles</button>
                  <button className="btn btn-secondary">Comprar ahora</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="nav2-button nav2-prev" onClick={goToPrev}>
          ‹
        </button>
        <button className="nav2-button nav2-next" onClick={goToNext}>
          ›
        </button>

        <div className="carousel-indicators">
          {destacados.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="carousel-info">
        <p className="text-sm opacity-75">
          Productos destacados - {currentIndex + 1} de {destacados.length}
        </p>
      </div>
    </div>
  );
};

export default Hero;
