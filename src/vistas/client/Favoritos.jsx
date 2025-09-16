// src/componentes/Favoritos.jsx
import { useState } from "react";
import favoritosDb from "../../api/db.json";
import { useAuth } from "../../contexts/AuthContext";



export default function Favoritos() {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState(favoritosDb.productos || []);
  const [msg, setMsg] = useState("");


  if (!user) {
    return (
      <p className="container m-3">
        Debes iniciar sesión para ver tus favoritos.
      </p>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Mis Favoritos</h2>
      <p className="subtitle text-center">Cosas que me gustan</p>
      {msg && <div className="text-red-600 mb-2 text-center">{msg}</div>}

      <div className="container-card grid grid-cols-3 gap-3">
        {favoritos.map((fav) => (
          <div
            key={fav.id_favorito}
            className="card radius text-center flex flex-col justify-end p-2 bg-cover bg-center"
            style={{ backgroundImage: `url(${fav.url_imagen})` }}
          >
            <h2 className="font-bold text-white subtitle text-gradient-secondary drop-shadow-lg">
              {fav.titulo}
            </h2>
            <div className="text-gray-200 mb-2 text-sm bg-black/50 rounded p-1">
              {fav.descripcion}
            </div>
            <button
              className="btn btn-danger"
              onClick={() => {
                setFavoritos((prev) => prev.filter((f) => f.id_favorito !== fav.id_favorito));
                setMsg(`Favorito #${fav.id_favorito} eliminado`);
                setTimeout(() => setMsg(""), 1500);
              }}
            >
              💔 Quitar de Favoritos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
