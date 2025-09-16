import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import favoritosDb from "../api/db.json"

async function getFavoritos() {
  return favoritosDb.favoritos;
}
async function addFavorito(id_productos, id_usuario = 2) {
  const existe = favoritosDb.favoritos.find(
    (f) => f.id_productos === id_productos && f.id_usuario === id_usuario
  );
  if (existe) throw { status: 409, error: "Ya existe" };

  const nuevo = {
    id_favorito: favoritosDb.favoritos.length + 1,
    id_usuario,
    id_productos,
  };
  favoritosMock.push(nuevo);
  return nuevo;
}

async function removeFavorito(id_favorito) {
  favoritosDb.favoritos = favoritosDb.favoritos.filter((f) => f.id_favorito !== id_favorito);
  return true;
}

export default function LikeButton({ producto, onLikeChange = null }) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [favId, setFavId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const idProducto = Number(producto?.id_producto ?? producto?.id);

  useEffect(() => {
    let alive = true;
    async function fetchFavorite() {
      setMsg("");
      if (!user || !idProducto) {
        if (alive) {
          setIsFav(false);
          setFavId(null);
        }
        return;
      }
      try {
        const list = await getFavoritos();
        const match = Array.isArray(list)
          ? list.find(
              (f) =>
                Number(f.id_productos) === idProducto &&
                f.id_usuario === user.id
            )
          : null;
        if (!alive) return;
        setIsFav(!!match);
        setFavId(match?.id_favorito ?? null);
      } catch {
        if (alive) setMsg("Error al consultar favorito");
      }
    }
    fetchFavorite();
    return () => {
      alive = false;
    };
  }, [user, idProducto]);

  const handleToggle = async () => {
    if (!user) {
      setMsg("Inicia sesión");
      return;
    }
    if (busy) return;
    setBusy(true);
    setMsg("");
    try {
      if (isFav && favId) {
        await removeFavorito(favId);
        setIsFav(false);
        setFavId(null);
      } else {
        const nuevo = await addFavorito(idProducto, user.id);
        setIsFav(true);
        setFavId(nuevo?.id_favorito ?? null);
      }
      if (onLikeChange) await onLikeChange(idProducto);
    } catch (e) {
      if (e?.status === 409) {
        setIsFav(true);
        setMsg("Ya estaba en favoritos");
      } else {
        setMsg("Error al actualizar favorito");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className="like p-0 glass"
      onClick={handleToggle}
      disabled={busy}
      title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={isFav}
      style={{ fontSize: 22, lineHeight: 1 }}
    >
      {isFav ? "❤️" : "🤍"}
      <span className="ml-1 text-sm text-gray-600">
        {producto?.likes_count ?? 0}
      </span>
      {msg && <span className="text-primary ml-1">{msg}</span>}
    </button>
  );
}
