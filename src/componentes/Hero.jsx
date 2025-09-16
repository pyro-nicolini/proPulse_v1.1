import { useState, useEffect, useCallback } from "react";
import productosDb from "../api/db.json"

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [productos, setProductos] = useState(productosDb.productos);

  const destacados = productos.filter(product => product.destacado);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === destacados.length - 1 ? 0 : prevIndex + 1
    );
  }, [destacados.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? destacados.length - 1 : prevIndex - 1
    );
  }, [destacados.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  // Keyboard nav2igation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToPrev, goToNext]);

  const formatPrice = (precio) => {
    if (!precio) return "";
    return `$${Number(precio).toLocaleString("es-CL")}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div 
        className="carousel-container"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="carousel-wrapper">
          {destacados.map((slide, index) => (
            <div
              key={slide.id_producto}
              className={`carousel-slide ${
                index === currentIndex 
                  ? 'active' 
                  : index < currentIndex 
                    ? 'prev' 
                    : 'next'
              }`}
              style={{
                backgroundImage: `url(${slide.url_imagen})`
              }}
            >
              <div className="slide-content">
                <h3 className="slide-title">{slide.titulo}</h3>
                <p className="slide-description">{slide.descripcion}</p>
                <div className="slide-price">
                  {formatPrice(slide.precio)}
                </div>
                <div className="slide-buttons">
                  <button className="btn btn-primary">
                    Ver más detalles
                  </button>
                  <button className="btn btn-secondary">
                    Comprar ahora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="nav2-button nav2-prev"
          onClick={goToPrev}
          aria-label="Slide anterior"
        >
          ‹
        </button>

        <button 
          className="nav2-button nav2-next"
          onClick={goToNext}
          aria-label="Slide siguiente"
        >
          ›
        </button>

        <div className="carousel-indicators">
          {destacados.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
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