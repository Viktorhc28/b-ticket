const req = require('express/lib/request');
const { Op } = require('sequelize');
const {
    Usuario,
    Rol,
    Vehiculo,
    Revision,
    TipoGasto,
    Producto,
    TipoActualizacion,
    Sucursal
} = require('../modules/associations')

///////////////////////
//Validadores Usuario//
///////////////////////
const emailExisteUsuario = async (email = '') => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({
        where: {
            email: email
        }
    });

    if (existeEmail) {
        throw new Error(`El correo: ${email}, ya está registrado`);
    }
}

const emailComprobar = async (email = '') => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({
        where: {
            email: email
        }
    });
    if (!existeEmail) {
        throw new Error(`El correo: ${email}, no existe`);
    } else {
        req.usuarioEmail = existeEmail;
    }
}

/**
 * Valida la existencia de un Usuario en base al ID, arrojando excepción en caso de que no exista.
 * @param {*} id ID de vehículo.
 */
const existeUsuarioPorId = async (id = '') => {
    // Verificar si usuario existe
    const existeUsuario = await Usuario.findByPk(id);

    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

/**
 * Valida la existencia de un Vehículo en base al ID, arrojando excepción en caso de que no exista.
 * @param {*} id ID de vehículo.
 */
const existeVehiculoPorId = async (id = '') => {
    // Verificar si usuario existe
    const existeUsuario = await Vehiculo.findByPk(id);

    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

/**
 * Valida la existencia de un Revision en base al ID, arrojando excepción en caso de que no exista.
 * @param {*} rol_id ID de revision.
 */
const existeRevisionPorId = async (id = '') => {
    // Verificar si usuario existe
    const existeUsuario = await Revision.findByPk(id);

    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

/**
 * Valida la existencia de un Rol en base al ID, arrojando excepción en caso de que no exista.
 * @param {*} rol_id ID de vehículo.
 */
const esRoleValido = async (rol_id = '') => {

    const existeRol = await Rol.findOne({
        where: { id: rol_id }
    });
    if (!existeRol) {
        throw new Error(`El rol no está registrado en la BD`);
    }
}

/**
 * Determina si existe un tipo de actualización en la base de datos con un determinado ID.
 *
 * @async
 * @param {number} [id=''] - El ID del tipo de actualización a buscar.
 * @throws {Error} Si el ID no existe.
 */
const existeTipoActualizacionPorId = async (id = '') => {
    const existeTipoActualizacion = await TipoActualizacion.findByPk(id);

    if (!existeTipoActualizacion) {
        throw new Error(`El id ${id} no existe`);
    }
}

/**
 * Verifica si existe un registro en la tabla `Producto` con el `id` especificado en una línea ya sea de actualización - compra - venta y agrega el valor de `stock_minimo` al objeto `values` con el valor correspondiente del registro de producto.
 * @async
 * @function existeProductoPorIdLinea
 * @param {Object} values - Objeto que contiene los valores de la línea.
 * @param {number} values.producto_id - Id del producto en la línea.
 * @returns {Promise<void>}
 * @throws {Error} - Si no se encuentra un registro en la tabla `Producto` con el `id` especificado en la línea.
 */
const existeProductoPorIdLinea = async (values) => {

    const id_producto = values.producto_id;
    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
        throw new Error(`El registro de producto con id ${id_producto} no existe`);
    }
    values.nombre = producto.nombre
    values.stock_minimo = (producto.stock_minimo) ? producto.stock_minimo : 0
};

/**
* Verifica si existe un registro en la tabla Tipo Gasto con el id especificado.
*
* @async
* @function existeTipoGastoPorId
* @param {number} id - El id del registro que se desea buscar.
* @throws {Error} Error indicando que el id no existe en la tabla Tipo Gasto.
*/
const existeTipoGastoPorId = async (id = '') => {
    const existeTipoGasto = await TipoGasto.findByPk(id);

    if (!existeTipoGasto) {
        throw new Error(`El id ${id} no existe`);
    }
}

/**
 * Determina si existe una sucursal en la base de datos con un determinado ID.
 *
 * @async
 * @param {number} [id=''] - El ID de la sucursal a buscar.
 * @throws {Error} Si el ID no existe.
 */
const existeSucursalPorId = async (id = '') => {
    const existeSucursal = await Sucursal.findByPk(id);

    if (!existeSucursal) {
        throw new Error(`El id ${id} no existe`);
    }
}


module.exports = {
    emailExisteUsuario,
    existeUsuarioPorId,
    esRoleValido,
    emailComprobar,
    existeVehiculoPorId,
    existeRevisionPorId,
    existeTipoActualizacionPorId,
    existeProductoPorIdLinea,
    existeTipoGastoPorId,
    existeSucursalPorId,
}