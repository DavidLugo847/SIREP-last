const controlador = {};
const query = require('../database/pool-conexion');


/**
 * @returns {render} Rederiza produccionUp.ejs 
 */
 controlador.Produccion = async (req,res)=>{
    try {
        let sql = `SELECT 
            DISTINCT fk_codigo_up as codigo_up, 
            up.Nombre 
        FROM productos p 
        JOIN unidades_productivas up on up.codigo_up = p.fk_codigo_up 
        WHERE up.estado = 'Activo'` // unidades productivas 
        let rows = await query(sql);
        return res.render('admin/produccionUp.ejs',{up:rows, profile: req.session.user});   
    } catch (e) {
        console.log("controller.produccionUp/Produccion Error: " + e);
    }
}


/**
 * Función que lista las producciones que tienen disponibilidad de distibución / produccionUp.ejs
 * @returns {JSON} JSON con las producciones 
 */
controlador.Listar_Produccion_Pendiente = async (req, res) => {
    try{
        let sql = `SELECT * FROM lista_produccion_up WHERE Disponible > 0 ORDER BY Id_produccion ASC`;
        let rows = await query(sql);
        return res.json(rows);
    } catch (e){
        console.log("controller.produccionUp/Listar_Produccion_Pendiente Error: " + e);
    }
}

/**
 * Asigna distribución de producto a un punto de venta / produccionUp.ejs
 * @param {Number} cantidad Cantidad de producto a distribuir
 * @param {Number} id_punto_venta Id del punto de venta
 * @param {Number} id_produccion Id de la producción que se distribuira
 * @returns {JSON} JSON con el estado del proceso
 */
controlador.Asignar_Inventario = async (req, res) => {
    try {
        let operacion = 'ActualizarBodega';
        let cantidad = req.body.cantidad;
        let id_punto_venta = req.body.punto_venta;
        let id_produccion  = req.body.id_produccion;
        let inventory_query = `SELECT id_inventario, Id_produccion as id_produccion,
                Codigo_pdto as id_producto, Producido, Distribuido, Disponible,
                fk_id_punto_vent as id_punto_venta
            FROM lista_produccion_up lup 
                JOIN inventario i on lup.Codigo_pdto = i.fk_codigo_pdto
            WHERE fk_id_punto_vent = '${id_punto_venta}' and Id_produccion = '${id_produccion}'`;
        let inventory_rows = await query(inventory_query);
        // Obtiene el id del inventario por consulta
        let id_inventario = inventory_rows[0].id_inventario;
        //-----------------------------------------
        let disponible = inventory_rows[0].Disponible;
        let distribuido = inventory_rows[0].Distribuido;
        if(!distribuido) distribuido = 0;
        //-----------------------------------------
        if(cantidad > disponible) return res.json({status: 'error', message: 'La cantidad supera el stock'});
        // Realiza la operación en el procedimiento
        let sql = `CAll Administrar_inventario('${operacion}',${cantidad},${id_produccion},${id_inventario})`;
        await query(sql);
        return res.json({status: 'success', message: 'Distribución asignada exitosamente'});
        
    } catch (e) {
        console.log("controller.produccionUp/Asignar_Inventario Error: " + e);
    }
}

/**
 * Lista los puntos de venta que tiene asignado un producto / produccionUp.ejs
 * @param {Number} producto Id del producto 
 * @returns {JSON} JSON con los puntos de ventas que tienen asignado un producto 
 */
controlador.Listar_Punto_Venta_Producto = async (req, res) => {
    try {
        let producto = req.body.producto;
        let sql = `SELECT DISTINCT Id_punto_vent,Nombre FROM inventario inv
        join punto_venta pv on pv.Id_punto_vent=inv.fk_id_punto_vent
        where fk_codigo_pdto ='${producto}'`;
        let rows = await query(sql);
        return res.json(rows);
    } catch (e) {
        console.log("controller.produccionUp/Listar_Punto_Venta_Producto Error: " + e);
    }
}

/**
 * Lista las producciones generadas por una unidad productiva / produccionUp.ejs
 * @param {Number} unidad Id de la unidad productiva 
 * @returns {JSON} JSON con las producciones
 */
controlador.Listar_Produccion = async (req,res)=>{
    try{
        var idup = req.body.unidad;
        var sql = `select Id_produccion,Cantidad,DATE_FORMAT(produccion.fecha,'%d-%m-%Y') as fecha,
        Observacion, productos.Nombre, productos.Descripcion
        from produccion join productos on Codigo_pdto = fk_codigo_pdto where fk_codigo_up='${idup}'`;
        let rows = await query(sql);
        return res.json(rows);
    }
    catch(e){
        console.log("controller.produccionUp/Listar_Produccion Error: " + e);
    }
}

/**
 * Lista los productos de una unidad productiva / produccionUp.ejs
 * @param {Number} codigoup  Id del código de la únidad productiva
 * @returns {JSON} Lista producos de la únidad productiva
 */
controlador.llamarproductos = async(req,res)=>{
    try {
        let  unidadproductiva = req.body.codigoup;
        let sql = `select unidades_productivas.Nombre as nameup, 
                productos.Nombre as Namepdto, 
                productos.Descripcion as Descpdto,
                productos.Codigo_pdto as Codigo_pdto  
            from productos 
            join unidades_productivas on codigo_up=fk_codigo_up 
            where fk_codigo_up ='${unidadproductiva}'`; 
        let rows = await query(sql);
        return res.json(rows);
    } catch (e) {
        console.log("controller.produccionUp/llamarproductos Error: " + e);
    }
    
}

/**
 * Función que registra la producción / produccionUp.ejs
 * @param {Number} Cantidad     Cantidad de la producción	
 * @param {String} Observacion  Observación de la producción
 * @param {Number} fkp          Id del producto
 * @returns {JSON} Retorna JSON con el estado del proceso
 */
controlador.RegistrarProduccion = async (req,res)=>{
    try {
        let cant = req.body.Cantidad;
        let obs= req.body.Observacion;
        let fkp = req.body.fkp;
    
        let sql= `insert into produccion(Cantidad,Observacion,fecha,fk_codigo_pdto)
        values('${cant}','${obs}',CURDATE(),'${fkp}')`;
        await query(sql);
        return res.json({
            titulo: "Registro exitoso",
            icono: "success",
            mensaje: "La producción fue registrada con éxito"
        });   
    } catch (e) {
        console.log("controller.produccionUp/RegistrarProduccion Error: " + e);
    }
}

module.exports = controlador;