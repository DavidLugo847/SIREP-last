const query = require("../database/pool-conexion");
const controlador = {};

/**
 * @returns {Render} Retorna el render de unidades productivas
 */
controlador.Vista = async (req, res) => {
    try{
        let sql = "select * from personas where Rol = 'Lider UP';";
        let rows = await query(sql);
        return res.render('admin/unidadesproductivas',{Personas:rows, profile: req.session.user})
    }
    catch(e){
        console.log("controller.unidadesproductivas/Vista Error: " + e);
    }
};

/**
 * Función que lista todas las unidades productivas / unidadesproductivas.ejs
 * @returns {JSON} Retorna JSON con la información de todas las unidades productivas
 */
 controlador.ListaUnidadesProductivas = async (req, res) => {
    try{
        var sql = `select * from unidades_productivas 
        join personas on identificacion=fk_persona 
        order by codigo_up Asc`;
        let rows = await query(sql);
        return res.json(rows);
    }
    catch(e){
        console.log("controller.unidadesproductivas/ListaUnidadesProductivas Error: " + e);
    }
};

/**
 * Función que busca una unidad productiva / unidadesproductivas.ejs
 * @param {Number} Identificacion  Código de la unidad productiva
 * @returns {JSON} Retorna JSON con los datos de la unidad productiva
 */
controlador.Buscarunidadproductiva = async (req, res)=>{
    try{
        var identificador = req.body.Identificacion;
        let sql = `select up.codigo_up as codigo_up, up.Nombre as Nombre, up.Descripcion as Descripcion, 
            up.sede as sede, up.estado as estado, up.entrega_producto as entrega_producto, 
            up.fk_persona as fk_persona 
        from unidades_productivas up 
        where codigo_up=${identificador}`;
        let rows = await query(sql);
        return res.json(rows); 
    }
    catch(e){
        console.log("controller.unidadesproductivas/Buscarunidadproductiva Error: " + e);
    }  
};

/**
 * Función que actualiza unidad productiva / unidadesproductivas.ejs
 * @param {Number} Identificacion   Código de la unidad productiva
 * @param {String} Nombre           Nombre de la unidad productiva
 * @param {String} Descripcion      Descripción de la unidad productiva
 * @param {String} Sede             Sede de la U.P   (Yamboro, Centro)
 * @param {String} Estado           Estado de la U.P (Activo, Inactivo)
 * @param {Boolean} Entrega         Entrega products (0, 1)          
 * @param {Number} PersonaEncargada Identificacion del encargado
 * @returns {JSON} Retorna JSON con el estado de la operación
 */
controlador.ActualizarUnidadProductiva = async (req, res) =>{
    try{
        let id = req.body.Identificacion;
        let nombre = req.body.Nombre;
        let Descripcion = req.body.Descripcion;
        let Sede = req.body.Sede;
        let Estado = req.body.Estado;
        let Entrega = req.body.Entrega;
        let Persona = req.body.PersonaEncargada;
        let sql = `update unidades_productivas set Nombre='${nombre}',
            Descripcion='${Descripcion}',sede='${Sede}',estado='${Estado}',
            entrega_producto='${Entrega}', fk_persona='${Persona}' 
        where codigo_up='${id}'`;

        await query(sql)
        return res.json({  
            titulo : "Actualizado con Éxito",
            icono: "success",
            mensaje : "La Unidad Productiva ha sido Actualizada con Éxito",
            timer : 2000
        });
    }
    catch(e){
        console.log("controller.unidadesproductivas/ActualizarUnidadProductiva Error: " + e);
    }
}

/**
 * Función que registra unidad productiva / unidadesproductivas.ejs
 * @param {String} Nombre      Nombre de la unidad productiva
 * @param {String} Descripcion Descripción de la unidad productiva
 * @param {String} Sede        Sede de la U.P   (Yamboro, Centro)
 * @param {String} Estado      Estado de la U.P (Activo, Inactivo)
 * @param {Boolean} Entrega    Entrega products (0, 1)          
 * @param {Number} PersonaEncargada Identificacion del encargado
 * @returns {JSON} Retorna JSON con el estado de la operación
 */
 controlador.RegistrarUnidadProductiva = async (req, res) => {
    try{
        let nombre = req.body.Nombre;
        let Descripcion = req.body.Descripcion;
        let Sede = req.body.Sede;
        let Estado = req.body.Estado;
        let Entrega = req.body.Entrega;
        let Persona = req.body.PersonaEncargada;
        let sql = `insert into unidades_productivas(Nombre,Descripcion,sede,estado,entrega_producto,fk_persona, fk_sena_empresa) 
                  values('${nombre}','${Descripcion}','${Sede}','${Estado}','${Entrega}','${Persona}', 1)`;
        
        await query(sql)
        return res.json({  
            titulo : "Registro Exitoso",
            icono: "success",
            mensaje : "La Unidad Productiva ha sido Registrada con éxito",
            timer : 2000
        });
    }
    catch(e){
        console.log("controller.unidadesproductivas/RegistrarUnidadProductiva Error: " + e);
    }
        
};



module.exports = controlador;