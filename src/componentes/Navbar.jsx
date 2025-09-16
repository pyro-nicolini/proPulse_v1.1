import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/img/logos/logo_color_w.png";
import ContadorCarrito from "./ContadorCarrito";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout: doLogout, isAdmin } = useAuth();

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar container">

        <Link className="nav-link" to="/" onClick={closeMenu}>
          <img className="navbar-brand" src={logo} alt="ProPulse" />
        </Link>
        <button
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
          className="nav-toggle"
        >
          &#9776;
        </button>

        <div className="nav-links flex p-1">
          {isAdmin ? (
            <>
              <Link className="nav-link" to="/admin-profile" onClick={closeMenu}>
                Admin
              </Link>
              <Link className="nav-link" to="/plantilla" onClick={closeMenu}>
                Plantilla
              </Link>
            </>
          ) : (
            ""
          )}
          <Link className="nav-link" to="/profile-user" onClick={closeMenu}>
            Perfil
          </Link>
          <Link className="nav-link" to="/productos" onClick={closeMenu}>
            Productos
          </Link>
          <Link className="nav-link" to="/servicios" onClick={closeMenu}>
            Servicios
          </Link>
          <Link className="nav-link" to="/contacto" onClick={closeMenu}>
            Contacto
          </Link>
        </div>

        <div className="flex p-1 gap-1 items-center justify-center">
          {user ? <ContadorCarrito /> : null}

          {user ? (
            <>
            <div className="flex gap-1 items-center justify-center text-center">
              <p className="pt-1 text-silver-light flex text-center justify-center items-center mobile-hidden">
                Hi! {user.name}
              </p>
              <button
                onClick={doLogout}
                className="btn btn-secundary flex flex-col mobile-hidden"
                >
                Salir
              </button>
                </div>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link className="nav-link" to="/register" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <Link to="/profile-user" onClick={closeMenu}>
            Perfil
          </Link>

          <Link to="/productos" onClick={closeMenu}>
            Productos
          </Link>
          <Link to="/servicios" onClick={closeMenu}>
            Servicios
          </Link>
          <Link to="/contacto" onClick={closeMenu}>
            Contacto
          </Link>
          {user ? (
            <>
              <div className="flex gap-2 flex-col">
                <button onClick={doLogout} className="btn btn-secundary">
                  Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
