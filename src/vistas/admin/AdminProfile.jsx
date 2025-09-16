import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AdminForm from "./AdminForm";
import AdminShop from "./AdminShop";
import AdminVentas from "./AdminVentas";
import AdminPublicaciones from "./AdminPublicaciones";

export default function AdminProfile() {
  const { user } = useAuth();
  const [tab, setTab] = useState("ventas");

  if (!user) return <p className="m-4">No has iniciado sesión.</p>;
  if (user.rol !== "admin")
    return <p className="m-4">Solo para administradores.</p>;

  return (
    <div className="bg-black">
      <h3 className="p-1">Perfil Admin</h3>
      <div className="p-1 glass">
        <div className="w-full">
            <p className="">
              ID: {user.id} · {user.email}
            </p>
          </div>
          <div className="flex-col-responsive gap-2">
            <button
              className={`btn ${tab === "ventas" ? "primary" : ""}`}
              onClick={() => setTab("ventas")}
            >
              🛒 Ventas
            </button>
            <button
              className={`btn ${tab === "shop" ? "primary" : ""}`}
              onClick={() => setTab("shop")}
            >
              🏬 Shop
            </button>
            <button
              className={`btn ${tab === "crear" ? "primary" : ""}`}
              onClick={() => setTab("crear")}
            >
              ✏️ Crear
            </button>
            <button
              className={`btn ${tab === "publicaciones" ? "primary" : ""}`}
              onClick={() => setTab("publicaciones")}
            >
              📢 Publicaciones
            </button>
          </div>

        {tab === "ventas" && <AdminVentas />}
        {tab === "shop" && <AdminShop />}
        {tab === "crear" && <AdminForm onCreated={() => setTab("shop")} />}
        {tab === "publicaciones" && <AdminPublicaciones />}
      </div>
    </div>
  );
}
