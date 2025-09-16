import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import productoDb from "../../api/db.json";

export default function AdminPublicaciones() {
  const { user } = useAuth();

  const [productos] = useState(
    (productoDb?.productos || []).slice(0, 6).map((p, i) => ({
      id_producto: p.id_producto ?? p.id ?? i + 1,
      titulo: p.titulo ?? `Producto ${i + 1}`,
      tipo: p.tipo ?? "producto",
      precio: p.precio ?? 19990,
      stock: p.tipo === "servicio" ? null : (p.stock ?? 10),
      resenas_count: p.resenas_count ?? 0,
      likes_count: p.likes_count ?? 0,
      activo: typeof p.activo === "boolean" ? p.activo : true,
      url_imagen: p.url_imagen ?? `https://picsum.photos/seed/p-${i}/80/60`,
    }))
  );

  if (!user) return <p className="container m-3">No has iniciado sesión.</p>;
  if (user.rol !== "admin") return <p className="container m-4">Solo para administradores.</p>;

  return (
    <div className="container glass mt-1">
      <div className="ap-toolbar mb-2">
        <h3>Admin Publicaciones</h3>
        <div className="ap-actions">
          <input
            className="input"
            style={{ flex: 1, minWidth: 0 }}
            placeholder="Buscar por título…"
            disabled
          />
          <button className="btn" disabled>Refrescar</button>
        </div>
      </div>

      <div className="ap-stats bg-charcoal radius text-sm opacity-80 mb-2 p-2">
        <span>Productos: <b>{productos.length}</b></span>
      </div>

      <div className="border rounded ap-table-wrap">
        <table className="ap-table text-sm ap-sticky">
          <thead>
            <tr className="bg-black">
              <th className="text-left p-2">Producto</th>
              <th className="text-left p-2 ap-col-hide-sm">Tipo</th>
              <th className="text-right p-2">Precio</th>
              <th className="text-center p-2">Stock</th>
              <th className="text-center p-2 ap-col-hide-sm">Reseñas</th>
              <th className="text-center p-2">Likes</th>
              <th className="text-center p-2">Compras</th>
              <th className="text-center p-2 ap-col-hide-sm">Estado</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, idx) => {
              const isServicio = p.stock === null;
              const comprasFake = [5, 3, 9, 2, 6, 2][idx % 6];
              const likesFake = p.likes_count || [7, 6, 9, 5, 8, 7][idx % 6];

              return (
                <tr key={p.id_producto} className="border-t">
                  <td className="p-2">
                    <div className="ap-product">
                      <img src={p.url_imagen} alt="" className="ap-thumb" loading="lazy" />
                      <div>
                        <div className="font-medium">{p.titulo}</div>
                        <div className="opacity-60">#{p.id_producto}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 ap-col-hide-sm">{p.tipo}</td>
                  <td className="p-2 text-right">
                    ${Number(p.precio).toLocaleString("es-CL")}
                  </td>
                  <td className="p-2 text-center">{isServicio ? "∞" : p.stock}</td>
                  <td className="p-2 text-center ap-col-hide-sm">{p.resenas_count}</td>
                  <td className="p-2 text-center">{likesFake}</td>
                  <td className="p-2 text-center">{comprasFake}</td>
                  <td className="p-2 text-center ap-col-hide-sm">
                    {p.activo ? (
                      <span className="text-green-600 font-semibold">Activo</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactivo</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
