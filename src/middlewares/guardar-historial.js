const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { Historial } = require('../modules/associations');

const guardarHistorial = async (req = request, res = response, next) => {
    try {
        const usuario = req.usuario
        const token = req.header('Authorization')
        const { url, method, body, params } = req;
        const controlador = req.baseUrl
        let historial = await Historial.create({
            usuario_id: usuario.id,
            controlador: controlador,
            accion: url,
            metodo: method
        })
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    guardarHistorial
}