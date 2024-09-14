const express = require('express');
const routeReportes = express.Router();
const controlador_reportes = require("../controllers/controller.reportes");
let auth = require('../middlewares/middleware.auth');

/* REPORTES - ADMIN */
routeReportes.get('/productos-reservados', auth.authRoute, controlador_reportes.Vista_Reporte_Productos_Reservados);
routeReportes.get('/reporte-productos-reservados', controlador_reportes.Reporte_Productos_Reservados);

routeReportes.get('/rep_admin', auth.authRoute, controlador_reportes.vista_reporteAdmin); 
routeReportes.post('/Reporte_rep_admin',controlador_reportes.reporte_reporteAdmin);

routeReportes.get('/Reporcanti', auth.authRoute, controlador_reportes.vista_Reporcanti);
routeReportes.post('/Reporte_Reporcanti',controlador_reportes.Reporte_Reporcanti);

routeReportes.get('/rep_val_admi', auth.authRoute, controlador_reportes.vista_rep_val_admi); 
routeReportes.post('/Reporte_rep_val_admi',controlador_reportes.reporte_rep_val_admi);

routeReportes.get('/reporDPV', auth.authRoute, controlador_reportes.vista_reporDPV); 
routeReportes.post('/Reporte_reporDPV',controlador_reportes.reporte_reporDPV);

routeReportes.get('/rep_produccion_admi', auth.authRoute, controlador_reportes.vista_rep_produccion_admi);
routeReportes.post('/Reporte_rep_produccion_admi',controlador_reportes.reporte_rep_produccion_admi);

routeReportes.get('/reporVent', auth.authRoute, controlador_reportes.vista_reporVent);
routeReportes.post('/Reporte_reporVent',controlador_reportes.reporte_reporVent);

routeReportes.get('/productos-de-baja', auth.authRoute, controlador_reportes.Vista_Reporte_Productos_De_Baja);
routeReportes.post('/reporte-productos-de-baja', controlador_reportes.Reporte_Productos_De_Baja);

routeReportes.get('/productos-autoconsumo', auth.authRoute, controlador_reportes.Vista_Reporte_Productos_Autoconsumo);
routeReportes.post('/reporte-productos-autoconsumo', controlador_reportes.Reporte_Productos_Autoconsumo);

/* REPORTE - PUNTO DE VENTA */
routeReportes.get('/Reporte_Pvent', auth.authRoute, controlador_reportes.vista_Reporte_Pvent);
routeReportes.post('/Reporte_Reporte_Pvent',controlador_reportes.reporte_Reporte_Pvent);

routeReportes.get('/producto-cargo', auth.authRoute, controlador_reportes.vista_Reporte_Producto_Cargo);
routeReportes.post('/producto-cargo', auth.authRoute, controlador_reportes.Reporte_Producto_Cargo);

routeReportes.get('/reporte-historial-reservas', auth.authRoute, controlador_reportes.Vista_Reporte_Historial_Reservas);
routeReportes.post('/Reporte-historial-reservas', controlador_reportes.Reporte_Historial_Reservas);

/* REPORTE - UNIDADES PRODUCTIVAS */
routeReportes.get('/reportUp', auth.authRoute, controlador_reportes.vista_reportUp);
routeReportes.post('/Reporte_reportUp',controlador_reportes.reporte_reportUp);

routeReportes.get('/productos-facturados', auth.authRoute, controlador_reportes.vista_Reporte_Productos_Facturados);
routeReportes.post('/productos-facturados-up', auth.authRoute, controlador_reportes.reporte_Productos_Facturados_UP);

module.exports = routeReportes;