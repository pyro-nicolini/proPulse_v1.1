import { useParams } from "react-router-dom";
import { useState } from "react";
import StarRating from "./StarRating";

const reseñasMock = [
  { id_resena: 1, id_producto: 6, comentario: "Muy buen producto", calificacion: 5, fecha: "2025-09-10T12:00:00Z" },
  { id_resena: 2, id_producto: 6, comentario: "Entrega rápida", calificacion: 4, fecha: "2025-09-11T14:00:00Z" },
];

export default function ResenaForm({
  idProductoResena,
  resenasDelUsuario = [],
  setCantidadResenas = () => {},
}) {
  const { id } = useParams();
  const productId = Number(idProductoResena ?? id);

  const [resenas, setResenas] = useState(reseñasMock);
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    const texto = comentario.trim();
    const rating = Math.max(1, Math.min(5, Number(calificacion) || 5));

    if (texto.length < 10) {
      setMsg("El comentario debe tener al menos 10 caracteres.");
      setBusy(false);
      return;
    }

    const nuevaResena = {
      id_resena: resenas.length + 1,
      id_producto: productId,
      comentario: texto,
      calificacion: rating,
      fecha: new Date().toISOString(),
    };

    setResenas((prev) => [...prev, nuevaResena]);
    setCantidadResenas(resenas.length + 1);
    setComentario("");
    setCalificacion(5);
    setMsg("¡Gracias por tu reseña!");
    setBusy(false);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full p-2 flex flex-col gap-2"
      aria-describedby="resena-msg"
    >
      {msg ? (
        <p
          id="resena-msg"
          className="subtitle"
          role="status"
          aria-live="polite"
        >
          {msg}
        </p>
      ) : null}

      <label htmlFor="resena-calificacion" className="text-sm">
        Calificación
      </label>
      <StarRating
        id="resena-calificacion"
        name="calificacion"
        aria-label="Calificación del 1 al 5"
        value={calificacion}
        onChange={setCalificacion}
        disabled={busy}
      />

      <label htmlFor="resena-comentario" className="text-sm">
        Comentario
      </label>
      <textarea
        id="resena-comentario"
        name="comentario"
        className="input"
        rows={3}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Comparte tu experiencia (mínimo 10 caracteres)."
        minLength={10}
        disabled={busy}
        aria-required="true"
      />

      <button
        type="submit"
        className="btn-primary"
        disabled={busy || !comentario.trim()}
        aria-busy={busy ? "true" : "false"}
      >
        {busy ? "Enviando…" : "Enviar reseña"}
      </button>

      <div className="mt-4">
        <h3 className="text-sm font-semibold">Reseñas:</h3>
        <ul className="list-disc pl-5">
          {resenas
            .filter((r) => r.id_producto === productId)
            .map((r) => (
              <li key={r.id_resena}>
                ⭐ {r.calificacion} — {r.comentario}
              </li>
            ))}
        </ul>
      </div>
    </form>
  );
}
