const { response } = require('express');
const { Op } = require('sequelize');
const { Usuario } = require('../modules/associations');


const validarUpdateUsuario = async (req, res = response, next) => {

    const { id, email } = req.body;

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({
        where: { [Op.and]: [{ email: email }, [{ id: { [Op.ne]: id } }]] }
    });

    if (existeEmail) {
        return res.status(401).json({
            msg: `El correo: ${email}, ya está registrado para otro usuario.`,
            detalle: `El correo: ${email}, ya está registrado para otro usuario.`,
        });
    }
    next();
}

module.exports = {
    validarUpdateUsuario
}