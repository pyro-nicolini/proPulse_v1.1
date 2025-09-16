import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import ResenaForm from "./ResenaForm";
import { useAuth } from "../contexts/AuthContext";
import resenasDb from "../api/db.json"

function Resena({ idProducto = null }) {
  const [resenas, setResenas] = useState(resenasDb.resenas);
  const [cantidadResenas, setCantidadResenas] = useState(0);
  const { id } = useParams();
  const { user } = useAuth();


  const usuarioConResenas = resenas.filter((r) => r.id_usuario === user?.id);

  return (
    <>
      <h3 className="mt-1">Algunas experiencias:</h3>
      <div className="grid grid-cols-3 gap-1 items-start m-auto p-1">
        {resenas.map((r) => (
          <div key={r.id_resena} className="card w-full">
            {user?.id === r.id_usuario && (
              <button
                className="btn btn-secondary text-white"
                onClick={async () => {
                  await borrarResena(r.id_resena);
                  setCantidadResenas(cantidadResenas - 1);
                }}
              >
                Borrar
              </button>
            )}
            <StarRating
              className="flex justify-start mt-1 mb-1"
              value={r.calificacion}
            />
            <h4 className="flex justify-start p-0 m-0">{r.usuario}</h4>
            <p className="text-sm text-gray-500">
              {r.fecha_creacion.slice(0, 19).split("T")[1]} /{" "}
              {r.fecha_creacion.slice(0, 19).split("T")[0]}
            </p>
            <div className="card-white justify-between w-full items-start">
              <div className="flex justify-center items-start">
                <h2>"</h2>
                <p className="p-1 text-wrap w-full">{r.comentario}</p>
                <h2>"</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="w-mid">
          <ResenaForm
            idProducto={idProducto}
            resenasDelUsuario={usuarioConResenas}
            setCantidadResenas={setCantidadResenas}
          />
        </div>
      </div>
    </>
  );
}

export default Resena;
