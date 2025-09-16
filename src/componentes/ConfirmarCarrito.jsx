import { useState } from "react";
import { useNavigate } from "react-router-dom";
import productoDb from "../api/db.json"

export default function ConfirmBar({ items = [], totals = {}, errores = [], loading = false }) {

  const navigate = useNavigate();

  const onConfirm = () => {
    navigate("/checkout/resumen", {
      state: { items, totals },
    });
  };
 const [acepto, setAcepto] = useState(false);
  return (
    <div className="container w-full">
      {errores.length > 0 && (
        <ul>
          {errores.map((e, idx) => (
            <li key={idx}>• {e.motivo}</li>
          ))}
        </ul>
      )}

      <div className="card w-full">

        <label>
          <input
            type="checkbox"
            checked={acepto}
            onChange={(e) => setAcepto(e.target.checked)}
          />
          <span> Acepto términos y condiciones</span>
        </label>

        <button
        className="btn btn-primary w-full"
          onClick={onConfirm}
          disabled={!acepto || loading || !items.length}
        >
          {loading ? "Confirmando..." : "Confirmar y continuar"}
        </button>
      </div>
    </div>
  );
}
