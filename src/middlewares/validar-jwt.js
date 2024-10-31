const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require("../modules/associations")

const validarJWT = async (req = request, res = response, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({
                msg: 'No hay token en la petición'
            });
        }

        const { id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el id tiene estado true
        if (usuario.estado === -1) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: Inactivo'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT,
}