const express = require('express');
const ruta = express.Router();
const cont_produccion = require("../controllers/controller.produccionUp");
const auth = require('../middlewares/middleware.auth');

ruta.get('/produccion', auth.authRoute, cont_produccion.Produccion);
ruta.post('/formR',  auth.authToken, auth.isAdmin,  cont_produccion.RegistrarProduccion);
ruta.post("/Listar_Produccion", auth.authToken, auth.isAdmin, cont_produccion.Listar_Produccion);
ruta.post("/Asignar_Inventario", auth.authToken, auth.isAdmin, cont_produccion.Asignar_Inventario);
ruta.post('/llamarproductos', auth.authToken, auth.isAdmin, cont_produccion.llamarproductos);

ruta.post("/Listar_Produccion_Pendiente", auth.authToken, auth.isAdmin, cont_produccion.Listar_Produccion_Pendiente);
ruta.post("/Listar_Punto_Venta_Producto", auth.authToken, auth.isAdmin, cont_produccion.Listar_Punto_Venta_Producto);

module.exports = ruta;