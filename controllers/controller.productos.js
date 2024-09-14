const controlador = {};
const query = require("../database/pool-conexion");

const multer = require("multer-js");

const storage = multer.diskStorage({
    destination: function(req, img, cb) {
        cb(null, "public/img/products");
    },
    filename: function(req, img, cb) {
        const datoahora = Date.now();
        req.fileNewName = datoahora + img.originalname;
        cb(null, req.fileNewName);
    },
});

const upload = multer({ storage: storage });
controlador.CargarImagen = upload.single("img");


/**
 * @returns {render} Retorna vista de gestión de productos
 */
 controlador.Vista = async(req, res) => {
    try {
        let ups = "select * from unidades_productivas";
        let cargos = "select * from cargo";
        let rows_ups = await query(ups);
        let rows_cargos = await query(cargos);
        return res.render("admin/productos", {
            Unidadesproductivas: rows_ups,
            Cargos: rows_cargos,
            profile: req.session.user,
        });
    } catch (e) {
        console.log("controller.productos/Vista Error: " + e);
    }
};

/**
 * Función que lista todos los productos del sistema
 * @returns {JSON} Retorna productos registrados en el sistema
 */
 controlador.ListaProductos = async(req, res) => {
    try {
        var sql =
            `select p.Codigo_pdto as Codigo_pdto, p.Nombre as Nombre_pdto, p.imagen as Imgpdto, 
                up.nombre as Nombre_up, p.Descripcion as Descripcion, p.Estado as Estado, p.Reserva as Reserva, 
                p.MaxReserva as MaxReserva, p.tipo as tipo, p.medidas as medidas, p.promocion as promocion, 
                p.porcentaje as porcentaje, if( p.hora_inicio is null,'00::00:00',p.hora_inicio) as hora_inicio, 
                if( p.hora_fin is null,'00:00:00',p.hora_fin) as hora_fin, 
                if(p.inventario is null,'No',p.inventario) as inventario 
            from productos p 
            join unidades_productivas up on codigo_up = fk_codigo_up order by Codigo_pdto asc`;
        let rows = await query(sql);
        return res.json(rows);
    } catch (e) {
        console.log("controller.productos/ListaProductos Error: " + e);
    }
};


/**
 * Función que registra un producto / productos.ejs
 * @param {String} Nombrepdto       Nombre del producto
 * @param {Number} unidapdtopdto    Id de la unida productiva
 * @param {String} Descripcionpdto  Descripcion del producto
 * @param {String} tipopdto         Tipo de producto       (Venta, Servicio)
 * @param {String} Reservapdto      Permite reservas                (Si, No)
 * @param {Number} Maximopdto       Número máximo de reservas
 * @param {TimeRanges} horainicio   Hora de inicio de reservas
 * @param {TimeRanges} horafin      Hora de fin de reservas
 * @param {String} inventario       Lleva control de inventario     (Si, No)
 * @param {String} Estadopdto       Estado del producto  ( activo, inactivo)
 * @param {String} medida           Medida de venta del producto 
 * @param {String} promocion        Producto tiene promoción        (Si, No)
 * @param {String} porcentaje       Porcentaje de promoción  0-100
 * @param {String} reserva_grupal   Permite reservas grupales       (Si, No)
 * @returns {JSON} Retorna JSON con el estado del proceso realizado
 */
controlador.RegistrarProductos = async(req, res) => {
    try {
        let nombre = req.body.Nombrepdto;
        let imagen = req.fileNewName;
        if (!imagen) imagen = "product.jpg";
        let up = req.body.unidapdtopdto;
        let Descripcion = req.body.Descripcionpdto;
        let tipo = req.body.tipopdto;
        let Reserva = req.body.Reservapdto;
        let Maximo = req.body.Maximopdto;
        let horastart = req.body.horainicio;
        let horaend = req.body.horafin;
        let inventario = req.body.inventario;
        let estado = req.body.Estadopdto;
        let medida = req.body.medida;
        let promocion = req.body.promocion;
        let porcentaje = req.body.porcentaje;
        let reserva_grupal = req.body.reserva_grupal;
        if(!reserva_grupal) reserva_grupal = 'No';
        if(!porcentaje) porcentaje = 0;
        let sql = `insert into productos (Nombre,Descripcion,imagen,Estado,Reserva,MaxReserva,
            Tipo,fk_codigo_up,hora_inicio, hora_fin,inventario,medidas, promocion, porcentaje, ReservaGrupal) 
            values("${nombre}","${Descripcion}","${imagen}",'${estado}','${Reserva}','${Maximo}','${tipo}','${up}','${horastart}',
            '${horaend}','${inventario}','${medida}','${promocion}','${porcentaje}', '${reserva_grupal}')`;

        
        await query(sql);
        return res.json({
            titulo: "Registro Exitoso",
            icono: "success",
            mensaje: "El Producto Registrado con éxito",
            timer: 2000,
        });
    } catch (e) {
        console.log("controller.productos/RegistrarProductos Error: " + e);
    }
};

/**
 * Función que actualizar un producto / productos.ejs
 * @param {String} Nombrepdto       Nombre del producto
 * @param {Number} unidapdtopdto    Id de la unida productiva
 * @param {String} Descripcionpdto  Descripcion del producto
 * @param {String} tipopdto         Tipo de producto       (Venta, Servicio)
 * @param {String} Reservapdto      Permite reservas                (Si, No)
 * @param {Number} Maximopdto       Número máximo de reservas
 * @param {TimeRanges} horainicio   Hora de inicio de reservas
 * @param {TimeRanges} horafin      Hora de fin de reservas
 * @param {String} inventario       Lleva control de inventario     (Si, No)
 * @param {String} Estadopdto       Estado del producto  ( activo, inactivo)
 * @param {String} medida           Medida de venta del producto 
 * @param {String} promocion        Producto tiene promoción        (Si, No)
 * @param {String} porcentaje       Porcentaje de promoción  0-100
 * @param {String} reserva_grupal   Permite reservas grupales       (Si, No)
 * @returns {JSON} Retorna JSON con el estado del proceso realizado
 */
controlador.Actualizarproductos = async(req, res) => {
    try {
        let id = req.body.Identificacionact;
        let sql_producto = `select imagen from productos where Codigo_pdto = ${id}`;
        let rows = await query(sql_producto);
        if(rows.length <= 0) return res.json({status: 'error', message: 'Producto no encontrado'});
        
        let nombre = req.body.Nombrepdtoact;
        let img = req.fileNewName;
        if (!img) img = rows[0].imagen;
        let up = req.body.unidapdtopdtoact;
        let Descripcion = req.body.Descripcionpdtoact;
        let tipo = req.body.tipopdtoact;
        let Reserva = req.body.Reservapdtoact;
        let Maximo = req.body.Maximopdtoact;
        let horastart = req.body.horainicioact;
        let horaend = req.body.horafinact;
        let inventario = req.body.inventarioact;
        let estado = req.body.Estadopdtoact;
        let medida = req.body.medidapdtoact;
        let promocion = req.body.promocionact;
        let porcentaje = req.body.porcentajeact;
        let reserva_grupal = req.body.reserva_grupal;
        if(!porcentaje) porcentaje = 0;
        if(!reserva_grupal) reserva_grupal = 'No';

        let sql = `update productos set Nombre="${nombre}",
            Descripcion="${Descripcion}",
            imagen="${img}",
            Estado='${estado}',Reserva='${Reserva}',MaxReserva='${Maximo}',Tipo='${tipo}',fk_codigo_up='${up}',
        hora_inicio='${horastart}',hora_fin='${horaend}',inventario='${inventario}',medidas='${medida}',
        promocion='${promocion}',porcentaje='${porcentaje}',ReservaGrupal='${reserva_grupal}' where Codigo_pdto='${id}'`;

        await query(sql);
        return res.json({
            titulo: "Actualizado con Exito",
            icono: "success",
            mensaje: "El Producto ha sido Actualizado con éxito",
            timer: 2000,
        });
    } catch (e) {
        console.log("controller.productos/Actualizarproductos Error: " + e);
    }
};

/**
 * Función que busca el producto en base a un código
 * @param {Number} Identificacion Código del producto
 * @returns {JSON}  Retorna JSON con los datos del producto
 */
controlador.buscarpdto = async(req, res) => {
    try {
        var identificador = req.body.Identificacion;
        let sql = `select p.Codigo_pdto as Codigo_pdto, 
            p.Nombre as Nombre, p.Descripcion as Descripcion, p.Estado as Estado, 
            p.Reserva as Reserva, p.MaxReserva as MaxReserva, 
            p.fk_codigo_up as fk_codigo_up, p.tipo as tipo, p.medidas as medidas, 
            p.hora_inicio as hora_inicio, p.hora_fin as hora_fin, 
            p.inventario as inventario, p.promocion as promocion, 
            p.porcentaje as porcentaje, p.ReservaGrupal as reserva_grupal 
        from productos p  
        where Codigo_pdto='${identificador}'`;
        let rows = await query(sql);
        return res.json(rows);
    } catch (e) {
        console.log("controller.productos/buscarpdto Error: " + e);
    }
};

/**
 * Lista los precios de un producto
 * @param {Number} idpdto Id del producto
 * @returns {JSON} Retorna JSON con los precios del producto
 */
controlador.ListarPrecios = async(req, res) => {
    try {
        let codigopdto = req.body.idpdto;
        let sql = `select precios.id_precio as id_precio, cargo.nombre_cargo as cargonombre, 
            precios.precio as preciopdto, productos.Nombre as nombrepdto, precios.fk_producto as fk_producto, 
            precios.fk_cargo as fk_cargo, productos.Codigo_pdto as Codigo_pdto 
        from cargo 
        join precios on idcargo = fk_cargo 
        join productos on fk_producto = Codigo_pdto 
        where Codigo_pdto='${codigopdto}'`;
        let rows = await query(sql);
        return res.json(rows);
    } catch (e) {
        console.log("controller.productos/ListarPrecios Error: " + e);
    }
};

/**
 * Registra los precios del producto
 * @param {Number} pdto    Código del producto 
 * @param {Number} cargo   Id del cargo
 * @param {Number} precio  Precio del cargo
 * @returns {JSON} Retorna JSON con el estado de la consulta
 */
controlador.RegistrarPrecios = async(req, res) => {
    try {
        let sql = '';
        let pdto = req.body.pdto;
        let cargo = req.body.cargo;
        let precio = req.body.precio;

        let valida_precio = await query(`SELECT * FROM precios 
            WHERE fk_cargo = '${cargo}' 
            AND fk_producto = '${pdto}'`);

        if(valida_precio.length > 0) {
            sql = `update precios set precio='${precio}' where fk_producto='${pdto}' AND fk_cargo='${cargo}'`
        }
        else {
            sql = `insert into precios(fk_producto,fk_cargo,precio) values('${pdto}','${cargo}','${precio}')`;
        }
        
        await query(sql);

        return res.json({
            titulo: "Registro Exitoso",
            icono: "success",
            mensaje: "El Precio ha sido registrado con éxito",
            timer: 2000,
        });
    } catch (e) {
        console.log("controller.productos/RegistrarPrecios Error: " + e);
    }
};

/**
 * Lista la información del producto
 * @param {Number} Codigopdto Código del producto
 * @returns {JSON} Retorna JSON con los datos del producto
 */
controlador.BuscarPrecio = async(req, res) => {
    try {
        var idpdto = req.body.Codigopdto;
        let sql = `select * from productos  where codigo_pdto = ${idpdto}`;
        let rows = await query(sql);
        return res.json(rows);
    } catch (e) {
        console.log("controller.productos/BuscarPrecio Error: " + e);
    }
};

module.exports = controlador;