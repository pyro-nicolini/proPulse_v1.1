import { productos } from "./db.json";
export  function getProductos() {
    return productos;
}

export  function getProducto(id) {
    return productos.find((p) => p.id === id);
}


/*
getToken()
getCarrito()
authRegister()
authLogin()
authMe()
isAuth()
setToken()

crearProducto()
actualizarProducto()
eliminarProducto()

agregarItemCarrito()
actualizarItemCarrito()
borrarItemCarrito()

getPedidos()
getPedido()
crearPedido()

getFavoritos()
addFavorito()
removeFavorito()

getResenasByProducto()
crearResena()
actualizarResena()
borrarResena()
*/