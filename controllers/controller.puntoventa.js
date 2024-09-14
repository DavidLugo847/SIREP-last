const query = require("../database/pool-conexion");
const controlador = {};

/**
 * @returns {render} Retorna vista del punto de venta
 */
controlador.Vista = (req, res) => {return res.render('admin/puntoventa',{profile: req.session.user})};

/**
 * Lista encargados de la unidad productiva / puntoventa.ejs
 * @returns {JSON} Retorna JSON con datos de la consulta
 */
controlador.ListarEncargadoPV = async (req, res) => {
    try {
        var sql = "SELECT * FROM personas WHERE Rol = 'Punto Venta'";
        let rows = await query(sql);
        return res.json(rows)
    } catch (e) {
        console.log("controller.puntoventa/ListarEncargadoPV Error: " + e);
    }
}

/**
 * Lista los puntos de venta
 * @returns {JSON} Retorna JSON con los puntos de venta
 */
controlador.ListaPuntoventa = async (req, res) => {
    try{
        var sql = `select pv.Estado as EstadoPVent, 
                Id_punto_vent, pv.Sede,Nombre,Nombres,fk_persona, 
                personas.Direccion as dirPersona, 
                pv.Direccion as dirPunto 
            from punto_venta as pv
            join personas on fk_persona=identificacion`;
        let rows = await query(sql);
        return res.json(rows)
    }
    catch(e){
        console.log("controller.puntoventa/ListaPuntoventa Error: " + e);
    }
};

/**
 * Función que registra un punto de venta
 * @param {String} Nombre     Nombre del punto de venta
 * @param {Number} Sede       Sede del punto de venta   (Yamboro, Centro)
 * @param {String} Direccion  Dirección del punto de venta
 * @param {String} Estado     Estado del punto de venta (Activo, Inactivo)
 * @param {Number} Persona    Identificacion de la persona encargada del punto de venta
 * @returns {JSON} Retorna JSON con el estado de la petición
 */
controlador.RegistrarPunto = async (req, res)=>{
    try{
        let nombre = req.body.Nombre;
        let sede = req.body.Sede;
        let dir = req.body.Direccion;
        let estado = req.body.Estado;
        let persona = req.body.Persona;
        var sql = `insert into punto_venta(Sede,Direccion,Nombre,Estado, fk_persona)values('${sede}','${dir}','${nombre}','${estado}','${persona}')`;
        await query(sql);
        return res.json({  
            titulo : "Registro Exitoso",
            icono: "success",
            mensaje : "El punto ha sido regsitrado con éxito",
            timer : 2000
        });
    }
    catch(e){
        console.log("controller.puntoventa/RegistrarPunto Error: " + e);
    }
}

/**
 * Función que busca y lista los datos de un punto de venta
 * @param {Number} Identificacion Id del punto de venta
 * @returns {JSON} Retorna JSON con los datos del punto de venta
 */
controlador.Buscarpuntv = async(req, res)=>{
    try{
        var identificador = req.body.Identificacion;
        let sql = 'select * from punto_venta where Id_punto_vent='+identificador;
        let rows = await query(sql);
        return res.json(rows);
    }
    catch(e){
        console.log("controller.puntoventa/Buscarpuntv Error: " + e);
    }
};

/**
 * Función que actualiza un punto de venta
 * @param {String} Identificacion     Id del punto de venta
 * @param {String} Nombre     Nombre del punto de venta
 * @param {Number} Sede       Sede del punto de venta   (Yamboro, Centro)
 * @param {String} Direccion  Dirección del punto de venta
 * @param {String} Estado     Estado del punto de venta (Activo, Inactivo)
 * @param {Number} PersonaEncargada    Identificacion de la persona encargada del punto de venta
 * @returns {JSON} Retorna JSON con el estado de la petición
 */
controlador.Actualformpuntv = async(req, res)=>{
    try{
        var identificador = req.body.Identificacion;
        let nombre = req.body.Nombre;
        let sede = req.body.Sede;
        let direccion = req.body.Direccion;
        let estado = req.body.Estado;
        let PersonaEncargada = req.body.PersonaEncargada;
        let sql = `update punto_venta set Nombre='${nombre}',
                    Sede='${sede}',
                    Estado='${estado}',
                    Direccion='${direccion}',
                    fk_persona='${PersonaEncargada}'  where Id_punto_vent=${identificador}`;
        await query(sql);
        return res.json({  
            titulo : "Actualizado con Exito",
            icono: "success",
            mensaje : "El punto ha sido Actualizado con éxito",
            timer : 2000
    });
    }catch(e){
        console.log("controller.puntoventa/Actualformpuntv Error: " + e);
    }
};
module.exports = controlador;