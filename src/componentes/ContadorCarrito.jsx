import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export default function ContadorCarrito() {
  const { items, totals } = useCart();
  const count = items.reduce((a, i) => a + (Number(i.cantidad) || 0), 0);
  
  const fmtCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });


  return (
    <Link to="/carrito">
      <button className="btn btn-secondary">
        🛒 {count} — {fmtCLP.format(totals.total || 0)}
      </button>
    </Link>
  );
}
